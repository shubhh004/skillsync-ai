import { useState, useEffect, useCallback } from 'react';
import RoadmapList from './RoadmapList';
import RoadmapForm from './RoadmapForm';
import RoadmapView from './RoadmapView';
import {
  createRoadmap, getRoadmaps, getRoadmap,
  deleteRoadmap as apiDeleteRoadmap,
  regenerateRoadmap as apiRegenerateRoadmap,
} from '../roadmapService';

function Toast({ message, type }) {
  return (
    <div className={`fixed bottom-6 right-6 z-50 px-4 py-3 rounded-xl shadow-lg text-sm font-medium text-white flex items-center gap-2 animate-pop-in ${
      type === 'error' ? 'bg-danger-500' : 'bg-success-500'
    }`}>
      {message}
    </div>
  );
}

export default function RoadmapTab({ sidebarOpen, setSidebarOpen }) {
  const [roadmaps,     setRoadmaps]     = useState([]);
  const [listLoading,  setListLoading]  = useState(true);
  const [activeId,     setActiveId]     = useState(null);
  const [activeRoadmap,setActiveRoadmap]= useState(null);
  const [viewLoading,  setViewLoading]  = useState(false);
  const [generating,   setGenerating]   = useState(false);
  const [regenerating, setRegenerating] = useState(false);
  const [showForm,     setShowForm]     = useState(false);
  const [toast,        setToast]        = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const loadList = useCallback(async () => {
    try {
      const list = await getRoadmaps();
      setRoadmaps(list);
      // Auto-select first if none active
      if (list.length > 0 && !activeId) {
        handleSelect(list[0]._id);
      } else if (list.length === 0) {
        setShowForm(true);
      }
    } catch {
      // non-fatal
    } finally {
      setListLoading(false);
    }
  }, [activeId]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => { loadList(); }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleSelect = useCallback(async (id) => {
    if (id === activeId) { setSidebarOpen && setSidebarOpen(false); return; }
    setActiveId(id);
    setShowForm(false);
    setViewLoading(true);
    setSidebarOpen && setSidebarOpen(false);
    try {
      const rm = await getRoadmap(id);
      setActiveRoadmap(rm);
    } catch {
      showToast('Failed to load roadmap.', 'error');
    } finally {
      setViewLoading(false);
    }
  }, [activeId, setSidebarOpen]);

  const handleNew = () => {
    setActiveId(null);
    setActiveRoadmap(null);
    setShowForm(true);
    setSidebarOpen && setSidebarOpen(false);
  };

  const handleGenerate = async (formData) => {
    setGenerating(true);
    try {
      const rm = await createRoadmap(formData);
      setActiveRoadmap(rm);
      setActiveId(rm._id);
      setShowForm(false);
      setRoadmaps(prev => [
        { _id: rm._id, targetCompany: rm.targetCompany, targetRole: rm.targetRole,
          timeline: rm.timeline, skillLevel: rm.skillLevel, readinessScore: rm.readinessScore,
          checklistDone: 0, checklistTotal: rm.checklist.length, updatedAt: rm.updatedAt },
        ...prev,
      ]);
    } catch (err) {
      showToast(err?.response?.data?.error || 'Failed to generate roadmap.', 'error');
    } finally {
      setGenerating(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await apiDeleteRoadmap(id);
      const next = roadmaps.filter(r => r._id !== id);
      setRoadmaps(next);
      if (activeId === id) {
        setActiveId(null);
        setActiveRoadmap(null);
        if (next.length > 0) { handleSelect(next[0]._id); }
        else { setShowForm(true); }
      }
    } catch {
      showToast('Failed to delete roadmap.', 'error');
    }
  };

  const handleRegenerate = async () => {
    if (!activeId) return;
    setRegenerating(true);
    try {
      const rm = await apiRegenerateRoadmap(activeId);
      setActiveRoadmap(rm);
      setRoadmaps(prev => prev.map(r => r._id === rm._id
        ? { ...r, readinessScore: rm.readinessScore, checklistDone: 0, checklistTotal: rm.checklist.length, updatedAt: rm.updatedAt }
        : r
      ));
      showToast('Roadmap regenerated successfully.');
    } catch (err) {
      showToast(err?.response?.data?.error || 'Failed to regenerate.', 'error');
    } finally {
      setRegenerating(false);
    }
  };

  const showEmpty = !listLoading && roadmaps.length === 0 && !showForm;

  return (
    <div className="flex flex-1 min-h-0 overflow-hidden">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/40 backdrop-blur-[2px] lg:hidden"
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <div className={[
        'fixed inset-y-3 left-3 z-40 w-72 rounded-3xl overflow-hidden lg:relative lg:inset-auto lg:rounded-none lg:z-auto lg:w-72 lg:flex-shrink-0',
        'transition-transform duration-300 ease-out-quart lg:translate-x-0',
        sidebarOpen ? 'translate-x-0' : '-translate-x-[calc(100%+0.75rem)]',
      ].join(' ')}>
        <RoadmapList
          roadmaps={roadmaps}
          loading={listLoading}
          activeId={activeId}
          onSelect={handleSelect}
          onNew={handleNew}
          onDelete={handleDelete}
        />
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0 bg-neutral-50 overflow-hidden">
        {viewLoading ? (
          <div className="flex-1 flex items-center justify-center">
            <div className="w-8 h-8 rounded-full border-2 border-neutral-200 border-t-brand-600 animate-spin" />
          </div>
        ) : showForm || showEmpty ? (
          <RoadmapForm onSubmit={handleGenerate} loading={generating} />
        ) : activeRoadmap ? (
          <RoadmapView
            roadmap={activeRoadmap}
            onRegenerate={handleRegenerate}
            onDelete={() => handleDelete(activeId)}
            regenerating={regenerating}
          />
        ) : (
          <div className="flex-1 flex items-center justify-center text-sm text-neutral-400">
            Select a roadmap or create a new one.
          </div>
        )}
      </div>

      {toast && <Toast message={toast.message} type={toast.type} />}
    </div>
  );
}
