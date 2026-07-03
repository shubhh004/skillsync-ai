const q = (id, category, difficulty, question, idealAnswer) => ({
  id, category, difficulty, question, idealAnswer,
});

const questions = [

  // ─── Java ───────────────────────────────────────────────────────────────────
  q('java_1',  'Java', 'Easy',   'What is the difference between JDK, JRE, and JVM?',
    'JVM (Java Virtual Machine) executes bytecode. JRE (Java Runtime Environment) contains JVM + class libraries needed to run Java apps. JDK (Java Development Kit) contains JRE + compilers and tools needed to develop Java apps.'),

  q('java_2',  'Java', 'Easy',   'What are the four pillars of OOP in Java?',
    'Encapsulation (binding data and methods, hiding internal state), Abstraction (exposing only essential details), Inheritance (acquiring properties of another class), Polymorphism (one interface, many implementations via overloading and overriding).'),

  q('java_3',  'Java', 'Easy',   'What is the difference between == and .equals() in Java?',
    '== compares object references (memory addresses) for objects, and values for primitives. .equals() compares the content/logical equality of objects. For String, == can return false even for identical text if they are different objects.'),

  q('java_4',  'Java', 'Easy',   'What is the difference between an abstract class and an interface in Java?',
    'An abstract class can have state, constructors, and concrete methods; a class can extend only one. An interface (Java 8+) can have default/static methods but no state; a class can implement multiple interfaces. Use abstract classes for shared base behavior, interfaces for contracts.'),

  q('java_5',  'Java', 'Easy',   'What is method overloading vs method overriding?',
    'Overloading: same method name, different parameter list in the same class (compile-time polymorphism). Overriding: subclass provides its own implementation of a superclass method with the same signature (runtime polymorphism, requires inheritance).'),

  q('java_6',  'Java', 'Easy',   'What are access modifiers in Java?',
    'private (class only), default/package-private (same package), protected (same package + subclasses), public (everywhere). They control visibility and encapsulation of classes, fields, and methods.'),

  q('java_7',  'Java', 'Easy',   'What is the final keyword in Java?',
    'final on a variable makes it a constant (cannot be reassigned). final on a method prevents overriding. final on a class prevents inheritance. It is used for immutability and security.'),

  q('java_8',  'Java', 'Medium', 'How does the Java Garbage Collector work?',
    'Java GC automatically reclaims memory for objects no longer reachable. The heap is split into Young (Eden + Survivor) and Old generations. Minor GC collects the Young generation; Major/Full GC collects the Old generation. Common algorithms: Mark-and-Sweep, G1GC, ZGC. Developers can suggest GC via System.gc() but cannot control it directly.'),

  q('java_9',  'Java', 'Medium', 'What is the difference between HashMap and Hashtable?',
    'HashMap is not thread-safe, allows one null key and multiple null values, and is faster. Hashtable is synchronized (thread-safe), does not allow null keys or values, and is slower. In multi-threaded contexts, prefer ConcurrentHashMap over Hashtable.'),

  q('java_10', 'Java', 'Medium', 'Explain the concept of Java Generics.',
    'Generics enable type-safe data structures and algorithms by allowing classes, interfaces, and methods to operate on any type specified at compile time. They eliminate casts and provide compile-time type checking. Example: List<String> ensures only Strings are stored, avoiding ClassCastException at runtime.'),

  q('java_11', 'Java', 'Medium', 'What is the difference between ArrayList and LinkedList?',
    'ArrayList uses a dynamic array; O(1) random access, O(n) insert/delete in the middle. LinkedList uses a doubly-linked list; O(n) access, O(1) insert/delete at head/tail. Use ArrayList for frequent reads, LinkedList for frequent insertions/deletions.'),

  q('java_12', 'Java', 'Medium', 'What are Java Streams and how are they used?',
    'Java Streams (Java 8+) provide a functional-style pipeline for processing sequences of data. Operations are lazy and can be sequential or parallel. Common operations: filter(), map(), reduce(), collect(). Example: list.stream().filter(x -> x > 0).map(x -> x * 2).collect(Collectors.toList()).'),

  q('java_13', 'Java', 'Medium', 'What is the difference between Comparable and Comparator?',
    'Comparable defines natural ordering via compareTo() in the class itself. Comparator defines external ordering via compare() and can have multiple implementations for the same class. Use Comparable for default sort order; Comparator for flexible, context-specific sorting.'),

  q('java_14', 'Java', 'Hard',  'Explain the Java Memory Model and the volatile keyword.',
    'The Java Memory Model (JMM) defines how threads interact through memory. Each thread has a local cache; without synchronization, changes may not be visible to other threads. volatile guarantees visibility (changes are immediately written to main memory) but not atomicity. For atomic compound operations, use synchronized or AtomicInteger etc.'),

  q('java_15', 'Java', 'Hard',  'What is the difference between synchronized and ReentrantLock?',
    'synchronized is simpler; the JVM handles lock/unlock automatically and it is re-entrant. ReentrantLock offers more control: tryLock() with timeout, lockInterruptibly(), fairness policy, and multiple Condition objects. ReentrantLock must be explicitly unlocked in a finally block.'),

  q('java_16', 'Java', 'Hard',  'What is a ClassLoader in Java and how does it work?',
    'ClassLoader dynamically loads .class files into the JVM. The hierarchy is Bootstrap (loads rt.jar/JDK classes) → Extension → Application. It follows the delegation model: a child asks the parent first; only loads itself if the parent cannot. Custom ClassLoaders enable hot-reload, sandboxing, and plugin systems.'),

  q('java_17', 'Java', 'Hard',  "Explain Java's exception hierarchy and checked vs unchecked exceptions.",
    'Throwable → Error (JVM-level, not recoverable) and Exception. Exception splits into checked (must be declared or caught; compile-time enforcement, e.g. IOException) and unchecked/RuntimeException (programming errors, e.g. NullPointerException). Checked exceptions model expected failure modes; unchecked model bugs.'),

  q('java_18', 'Java', 'Hard',  'What is double-checked locking for Singleton and why is volatile required?',
    'DCL checks the instance twice—once without and once with synchronization—to avoid the lock overhead after initialization. Without volatile, a partially constructed object can be visible to another thread due to instruction reordering. volatile prevents reordering and ensures the fully constructed object is published safely.'),

  q('java_19', 'Java', 'Medium', 'What are lambda expressions in Java 8?',
    'Lambda expressions are anonymous functions that implement a functional interface (an interface with a single abstract method). They enable a more concise, functional style. Example: Runnable r = () -> System.out.println("Hello"); or list.sort((a, b) -> a.compareTo(b));'),

  q('java_20', 'Java', 'Easy',  'What is the static keyword in Java?',
    'static members belong to the class, not to any instance. Static fields are shared across all instances. Static methods can be called without creating an object. Static initializer blocks run once when the class is loaded. Cannot access non-static members directly.'),

  q('java_21', 'Java', 'Medium', 'What is the purpose of the Optional class in Java 8?',
    'Optional<T> is a container that may or may not contain a non-null value. It replaces null returns to make absence explicit and force the caller to handle it. Key methods: isPresent(), get(), orElse(), orElseGet(), map(), ifPresent(). Reduces NullPointerExceptions.'),

  q('java_22', 'Java', 'Hard',  'Explain the concept of immutability and how to create an immutable class.',
    'An immutable class cannot be modified after construction. Rules: declare class final, all fields private and final, no setters, initialize all fields in the constructor, return deep copies of mutable fields. String and wrapper classes are examples. Immutable objects are inherently thread-safe.'),

  // ─── DSA ────────────────────────────────────────────────────────────────────
  q('dsa_1',  'DSA', 'Easy',   'What is the time complexity of binary search?',
    'O(log n). Binary search repeatedly halves the search space in a sorted array. Each step eliminates half the remaining elements, giving a logarithmic number of comparisons.'),

  q('dsa_2',  'DSA', 'Easy',   'What is a stack and where is it used?',
    'A stack is a LIFO (Last In, First Out) data structure with push, pop, and peek operations. Used in: function call stack, expression evaluation, undo operations, DFS traversal, balanced parenthesis checking.'),

  q('dsa_3',  'DSA', 'Easy',   'What is a queue and what are its applications?',
    'A queue is a FIFO (First In, First Out) data structure. Operations: enqueue, dequeue, peek. Used in: BFS traversal, CPU scheduling, printer spooling, message queues, level-order tree traversal.'),

  q('dsa_4',  'DSA', 'Easy',   'What is the difference between a singly and doubly linked list?',
    'A singly linked list has nodes with data and a next pointer. Traversal is one-directional; deletion requires tracking the previous node. A doubly linked list has next and prev pointers, allowing bidirectional traversal and O(1) deletion given a node reference, at the cost of extra memory.'),

  q('dsa_5',  'DSA', 'Easy',   'What is recursion? What is a base case?',
    'Recursion is when a function calls itself to solve a smaller subproblem. A base case is the termination condition that stops the recursion. Without a base case, recursion leads to infinite calls and a stack overflow.'),

  q('dsa_6',  'DSA', 'Easy',   'What is the difference between BFS and DFS?',
    'BFS (Breadth-First Search) explores level by level using a queue; finds shortest path in unweighted graphs. DFS (Depth-First Search) explores as deep as possible using a stack/recursion; used for cycle detection, topological sort, and connected components.'),

  q('dsa_7',  'DSA', 'Easy',   'What is the time and space complexity of merge sort?',
    'Time: O(n log n) in all cases. Space: O(n) auxiliary space for the temporary arrays used during merging. Merge sort is stable and predictable, making it preferred for linked lists and external sorting.'),

  q('dsa_8',  'DSA', 'Medium', 'Explain the two-pointer technique. Give an example.',
    'Two pointers maintain two indices into an array, often moving towards each other or at different speeds. Example: finding a pair with a given sum in a sorted array—start left=0, right=n-1; if sum matches return; if too small advance left; if too large decrement right. Reduces O(n²) brute force to O(n).'),

  q('dsa_9',  'DSA', 'Medium', 'What is a Binary Search Tree (BST) and what are its properties?',
    "A BST is a binary tree where each node's left subtree contains only nodes with values less than the node, and the right subtree contains only values greater. Inorder traversal produces sorted output. Average-case search/insert/delete: O(log n); worst-case (skewed): O(n)."),

  q('dsa_10', 'DSA', 'Medium', 'What is dynamic programming? How does it differ from recursion?',
    'Dynamic programming solves problems by breaking them into overlapping subproblems and storing results (memoization or tabulation) to avoid recomputation. Unlike plain recursion, which recomputes subproblems, DP has polynomial time complexity. Classic examples: Fibonacci, knapsack, longest common subsequence.'),

  q('dsa_11', 'DSA', 'Medium', 'Explain the sliding window technique.',
    'The sliding window maintains a contiguous subarray of fixed or variable size using two pointers or indices, updating the result as the window moves. It replaces O(n²) nested loops with O(n). Used for maximum sum subarray of size k, longest substring without repeating characters.'),

  q('dsa_12', 'DSA', 'Medium', 'What is a heap and how does heap sort work?',
    'A heap is a complete binary tree where each parent is greater (max-heap) or smaller (min-heap) than its children. Heap sort: build a max-heap O(n), then repeatedly extract the max and place it at the end O(n log n). Total: O(n log n) time, O(1) space (in-place).'),

  q('dsa_13', 'DSA', 'Medium', 'What is the difference between a graph and a tree?',
    'A tree is a connected acyclic undirected graph with n nodes and exactly n-1 edges. A graph can have cycles, disconnected components, and any number of edges. Trees have a root and parent-child relationships; graphs have no such constraint.'),

  q('dsa_14', 'DSA', 'Hard',  "Explain Dijkstra's algorithm and its time complexity.",
    'Dijkstra finds the shortest path from a source to all vertices in a weighted graph with non-negative edges. It greedily picks the unvisited vertex with the smallest tentative distance, relaxes its neighbors, and repeats. With a min-heap: O((V + E) log V). Does not work with negative edges.'),

  q('dsa_15', 'DSA', 'Hard',  'What is a trie and what problems does it solve efficiently?',
    'A trie is a tree where each node represents a character. Strings are stored by path from root to leaf. Supports O(L) insert, search, and prefix queries (L = string length). Used in autocomplete, spell check, IP routing, and word dictionaries.'),

  q('dsa_16', 'DSA', 'Hard',  'What is a segment tree and what operations does it support?',
    'A segment tree is a binary tree where each node stores an aggregate (sum, min, max) over a range of the array. Build: O(n). Range query and point update: O(log n). Used for range sum/min/max queries with updates. Lazy propagation extends it to support range updates.'),

  q('dsa_17', 'DSA', 'Hard',  'Explain the concept of topological sort and when it is applicable.',
    "Topological sort produces a linear ordering of vertices in a DAG (directed acyclic graph) such that for every edge u→v, u comes before v. Algorithms: Kahn's (BFS with in-degree tracking) or DFS with a stack. Used in task scheduling, build systems, and dependency resolution."),

  q('dsa_18', 'DSA', 'Medium', 'What is the difference between quicksort and merge sort?',
    'Quicksort: in-place, average O(n log n) but worst-case O(n²), not stable. Merge sort: requires O(n) extra space, always O(n log n), stable. Quicksort is usually faster in practice due to better cache performance; merge sort is preferred for stable sorting or linked lists.'),

  q('dsa_19', 'DSA', 'Easy',  'What is Big-O notation?',
    "Big-O notation describes the upper bound of an algorithm's time or space complexity as input size n grows. It classifies algorithms by how their resource usage scales: O(1) constant, O(log n) logarithmic, O(n) linear, O(n log n) linearithmic, O(n²) quadratic, O(2ⁿ) exponential."),

  q('dsa_20', 'DSA', 'Medium', 'What is memoization vs tabulation in dynamic programming?',
    'Memoization (top-down): recursive solution with a cache (hash map / array) to store results of computed subproblems; lazy—only computes what is needed. Tabulation (bottom-up): iterative, fills a table from base cases up; no recursion overhead. Tabulation is generally more space-efficient.'),

  q('dsa_21', 'DSA', 'Hard',  'Explain Union-Find (Disjoint Set Union) and its use cases.',
    "Union-Find tracks which elements belong to the same set. Operations: find (with path compression) and union (by rank/size). Near O(1) amortized per operation with both optimizations. Used in Kruskal's MST, cycle detection in undirected graphs, and connected components."),

  q('dsa_22', 'DSA', 'Medium', 'What is an LRU Cache and how would you implement one?',
    'An LRU (Least Recently Used) cache evicts the least recently accessed item when full. Implementation: HashMap (O(1) lookup) + Doubly Linked List (O(1) move to front/remove). On get: move to front. On put: add to front; if over capacity, remove from tail. Total O(1) for both operations.'),

  // ─── DBMS ───────────────────────────────────────────────────────────────────
  q('db_1',  'DBMS', 'Easy',   'What is a primary key? How is it different from a unique key?',
    'A primary key uniquely identifies each row in a table; it cannot be NULL and there can be only one per table. A unique key also enforces uniqueness but can contain NULL values (only one NULL allowed per column in most RDBMS) and a table can have multiple unique keys.'),

  q('db_2',  'DBMS', 'Easy',   'What are the ACID properties of a database transaction?',
    'Atomicity: all operations in a transaction succeed or none do. Consistency: the database moves from one valid state to another. Isolation: concurrent transactions do not interfere with each other. Durability: committed changes persist even after system failures.'),

  q('db_3',  'DBMS', 'Easy',   'What is normalization? What is 1NF, 2NF, 3NF?',
    '1NF: atomic values, no repeating groups. 2NF: 1NF + no partial dependency (every non-key attribute depends on the whole primary key). 3NF: 2NF + no transitive dependency (non-key attributes depend only on the primary key, not on other non-key attributes).'),

  q('db_4',  'DBMS', 'Easy',   'What is the difference between INNER JOIN, LEFT JOIN, and FULL OUTER JOIN?',
    'INNER JOIN returns only matching rows from both tables. LEFT JOIN returns all rows from the left table plus matching rows from the right (NULL for non-matches). FULL OUTER JOIN returns all rows from both tables, with NULLs where there is no match.'),

  q('db_5',  'DBMS', 'Easy',   'What is an index and why is it used?',
    'An index is a data structure (typically a B+ tree) that speeds up data retrieval by allowing the database to find rows without scanning the entire table. It trades write overhead and storage for faster reads. Used on columns frequently used in WHERE, JOIN, and ORDER BY clauses.'),

  q('db_6',  'DBMS', 'Easy',   'What is the difference between DELETE, TRUNCATE, and DROP?',
    'DELETE removes specific rows (can use WHERE), is logged, and can be rolled back. TRUNCATE removes all rows quickly by deallocating data pages, is minimally logged, resets identity columns, and cannot use WHERE. DROP removes the entire table structure and data permanently.'),

  q('db_7',  'DBMS', 'Easy',   'What is a foreign key?',
    'A foreign key is a column (or set of columns) that references the primary key of another table, enforcing referential integrity. It ensures that a value in the child table always corresponds to an existing value in the parent table, preventing orphan records.'),

  q('db_8',  'DBMS', 'Medium', 'Explain database transactions and isolation levels.',
    'Isolation levels control the visibility of uncommitted data between concurrent transactions. READ UNCOMMITTED (dirty reads allowed), READ COMMITTED (no dirty reads), REPEATABLE READ (no dirty/non-repeatable reads), SERIALIZABLE (full isolation, no phantom reads). Higher isolation reduces anomalies but decreases concurrency.'),

  q('db_9',  'DBMS', 'Medium', 'What is denormalization and when would you use it?',
    'Denormalization intentionally introduces redundancy by combining tables or adding derived columns to improve read performance. Used when normalized queries require too many joins that hurt performance. Common in data warehouses and read-heavy OLAP systems. Trade-off: faster reads, slower writes, more storage.'),

  q('db_10', 'DBMS', 'Medium', 'What is a B+ tree index and how does it work?',
    'A B+ tree is a self-balancing tree where all data is stored in leaf nodes (linked in sorted order) and internal nodes only store keys for routing. This allows range queries to scan leaves sequentially. Insert/delete/search: O(log n). Most RDBMS indexes use B+ trees.'),

  q('db_11', 'DBMS', 'Medium', 'What is a deadlock in databases? How is it resolved?',
    'A deadlock occurs when two or more transactions each wait for the other to release a lock, causing a circular wait. Resolution: timeout (abort a transaction after a wait threshold), deadlock detection (graph cycle detection and victim selection), or prevention (lock ordering, wound-wait schemes).'),

  q('db_12', 'DBMS', 'Medium', 'What is the difference between a clustered and non-clustered index?',
    'A clustered index determines the physical order of rows in the table; there can be only one per table (usually the primary key). A non-clustered index is a separate structure that stores a pointer to the actual row; multiple can exist per table. Clustered indexes are faster for range scans on sequential keys.'),

  q('db_13', 'DBMS', 'Medium', 'Explain the CAP theorem.',
    'CAP theorem states that a distributed data store can guarantee at most two of: Consistency (all nodes see the same data), Availability (every request receives a response), and Partition tolerance (system works despite network partitions). Since partitions are unavoidable in practice, systems trade between CP (consistent + partition-tolerant, e.g., HBase) and AP (available + partition-tolerant, e.g., Cassandra).'),

  q('db_14', 'DBMS', 'Hard',  'What is a view? What is a materialized view?',
    'A view is a virtual table defined by a SQL query; it is computed on every access and does not store data. A materialized view stores the query result on disk and can be indexed; it must be refreshed when base data changes. Materialized views trade storage and staleness for faster query performance.'),

  q('db_15', 'DBMS', 'Hard',  'What is database sharding?',
    'Sharding is horizontal partitioning of a database across multiple servers (shards), each holding a subset of the data. A shard key determines which shard stores each record. Sharding increases write throughput and storage capacity but adds complexity: cross-shard queries, re-sharding, and distributed transactions.'),

  q('db_16', 'DBMS', 'Hard',  'Explain query optimization and how a query planner works.',
    'The query planner (optimizer) transforms SQL into an efficient execution plan. It uses statistics (row counts, index selectivity) to estimate costs of alternative plans (nested loop, hash join, merge join; index scan vs full scan) and picks the cheapest one. It applies transformations like predicate pushdown and join reordering.'),

  q('db_17', 'DBMS', 'Hard',  'What is MVCC (Multi-Version Concurrency Control)?',
    'MVCC maintains multiple versions of a row so that readers do not block writers and vice versa. Each transaction sees a snapshot of the database at the start of the transaction. Old versions are cleaned by a vacuum/garbage collection process. Used in PostgreSQL, MySQL InnoDB, Oracle. Enables high concurrency without locking for reads.'),

  q('db_18', 'DBMS', 'Medium', 'What is the difference between SQL and NoSQL databases?',
    'SQL databases are relational, schema-based, and use structured tables with ACID guarantees (e.g., MySQL, PostgreSQL). NoSQL databases are schema-flexible and optimized for scale, speed, or specific access patterns: document (MongoDB), key-value (Redis), column-family (Cassandra), graph (Neo4j). NoSQL often trades ACID for BASE (Basically Available, Soft state, Eventually consistent).'),

  q('db_19', 'DBMS', 'Easy',  'What is a stored procedure?',
    'A stored procedure is a precompiled set of SQL statements stored in the database and executed by name. Benefits: reduced network traffic, code reuse, encapsulation of logic, security (grant execute permission without exposing tables). Can accept parameters and return results or output values.'),

  q('db_20', 'DBMS', 'Medium', 'What is an ER diagram and what are its components?',
    'An Entity-Relationship diagram models the logical structure of a database. Components: Entities (rectangles) representing objects/tables, Attributes (ovals) representing properties, Relationships (diamonds) representing associations between entities, and Cardinality (1:1, 1:N, M:N) indicating how many instances participate.'),

  q('db_21', 'DBMS', 'Hard',  'What is two-phase locking (2PL) and how does it ensure serializability?',
    'Two-phase locking ensures transactions acquire all locks before releasing any. Growing phase: acquire locks. Shrinking phase: release locks. This guarantees serializability (equivalent to some serial schedule). Strict 2PL holds all locks until commit, preventing cascading aborts. The trade-off is reduced concurrency and potential deadlocks.'),

  q('db_22', 'DBMS', 'Medium', 'What is the difference between OLTP and OLAP?',
    'OLTP (Online Transaction Processing) handles frequent, short, write-heavy transactions for day-to-day operations (e.g., banking, e-commerce); optimized for row-oriented storage and ACID. OLAP (Online Analytical Processing) handles complex queries over large datasets for reporting; optimized for columnar storage, aggregations, and read-heavy workloads.'),

  // ─── Operating System ────────────────────────────────────────────────────────
  q('os_1',  'Operating System', 'Easy',   'What is the difference between a process and a thread?',
    'A process is an independent program in execution with its own memory space (code, stack, heap, data). A thread is a lightweight unit of execution within a process, sharing the same memory space. Threads have lower creation/switching overhead but share state, requiring synchronization to avoid race conditions.'),

  q('os_2',  'Operating System', 'Easy',   'What are the different states of a process?',
    'New (being created), Ready (waiting for CPU), Running (executing on CPU), Waiting/Blocked (waiting for I/O or event), Terminated (finished execution). The OS scheduler moves processes between these states using a PCB (Process Control Block).'),

  q('os_3',  'Operating System', 'Easy',   'What is virtual memory?',
    'Virtual memory gives each process the illusion of a large, private address space by using disk storage as an extension of RAM. Pages not in RAM are stored on disk (swap space) and loaded on demand (page fault). Allows running programs larger than physical RAM and provides memory isolation between processes.'),

  q('os_4',  'Operating System', 'Easy',   'What is a deadlock? State the four Coffman conditions.',
    'Deadlock: a set of processes are blocked, each waiting for a resource held by another. Coffman conditions (all must hold simultaneously): Mutual Exclusion, Hold and Wait, No Preemption, Circular Wait. Prevention involves negating at least one condition.'),

  q('os_5',  'Operating System', 'Easy',   'What is the difference between preemptive and non-preemptive scheduling?',
    'Preemptive: the OS can forcibly remove the CPU from a running process (e.g., Round Robin, SRTF). Non-preemptive: a process runs until it voluntarily gives up the CPU (e.g., FCFS, non-preemptive SJF). Preemptive scheduling is better for interactive systems; non-preemptive is simpler.'),

  q('os_6',  'Operating System', 'Easy',   'What is thrashing?',
    'Thrashing occurs when a process spends more time swapping pages in/out of memory than executing. It happens when the sum of working sets of all processes exceeds physical RAM. The OS can mitigate it by reducing the degree of multiprogramming using the working-set model.'),

  q('os_7',  'Operating System', 'Easy',   'What is a semaphore?',
    'A semaphore is a synchronization primitive that controls access to a shared resource. It maintains an integer counter. wait() (P): decrement; if negative, block. signal() (V): increment; if threads are waiting, wake one. Binary semaphores (0 or 1) act as mutexes; counting semaphores manage pools of resources.'),

  q('os_8',  'Operating System', 'Medium', 'Explain demand paging and page faults.',
    'Demand paging loads pages into memory only when they are accessed. A page fault occurs when a process accesses a page not in RAM: the OS suspends the process, loads the page from disk, updates the page table, and resumes execution. This avoids loading unused pages but adds latency on first access.'),

  q('os_9',  'Operating System', 'Medium', 'What is the difference between paging and segmentation?',
    'Paging divides memory into fixed-size pages (no external fragmentation, but internal fragmentation possible). Segmentation divides memory into variable-size logical segments (code, stack, heap) matching program structure (no internal fragmentation, but external fragmentation possible). Modern systems combine both (segmented paging).'),

  q('os_10', 'Operating System', 'Medium', 'What are CPU scheduling algorithms? Explain Round Robin.',
    'Common algorithms: FCFS (simple, convoy effect), SJF (optimal average wait, requires future knowledge), Priority (starvation possible), Round Robin (time quantum, preemptive, good for time-sharing). RR: each process gets a fixed CPU time slice; if not finished, it is preempted and added to the back of the ready queue.'),

  q('os_11', 'Operating System', 'Medium', 'What is the difference between mutex and semaphore?',
    'A mutex (mutual exclusion lock) has ownership: only the thread that locked it can unlock it. A semaphore has no ownership; any thread can call signal(). Mutexes are for protecting critical sections; semaphores are for signaling between threads or limiting access to a pool of resources.'),

  q('os_12', 'Operating System', 'Medium', 'What are the page replacement algorithms?',
    "FIFO (Belady's anomaly possible), LRU (replace least recently used, good approximation of optimal but expensive), Optimal (replace the page that will not be used for the longest time, not implementable in practice—only used for analysis), Clock/NRU (approximates LRU cheaply using reference bits)."),

  q('os_13', 'Operating System', 'Medium', 'What is inter-process communication (IPC)?',
    'IPC mechanisms allow processes to communicate and synchronize. Methods: Pipes (unidirectional byte stream), Message Queues (structured messages), Shared Memory (fastest; requires synchronization), Sockets (network or local), Signals (asynchronous notifications), Semaphores (synchronization).'),

  q('os_14', 'Operating System', 'Hard',  'Explain the concept of context switching.',
    'A context switch saves the state (registers, PC, stack pointer, memory maps) of the current process into its PCB and loads the state of the next process. It is triggered by interrupts, system calls, or the scheduler. Context switches have overhead (save/restore + cache/TLB flushes); minimizing them improves performance.'),

  q('os_15', 'Operating System', 'Hard',  'What is a kernel? Explain monolithic vs microkernel.',
    'The kernel is the core of the OS managing hardware, memory, processes, and I/O. Monolithic kernel: all services (file system, drivers, networking) run in kernel space (faster, but less stable—a driver crash can crash the OS). Microkernel: only essential services in kernel; the rest run as user-space servers (more stable and portable, but slower IPC).'),

  q('os_16', 'Operating System', 'Hard',  'What is the Producer-Consumer problem and how is it solved?',
    'Producers generate data into a bounded buffer; consumers remove it. Problems: producers must wait when full, consumers when empty, and access must be mutually exclusive. Solution: use a mutex for critical section + two counting semaphores: empty (initialized to buffer size) and full (initialized to 0). Producer: wait(empty), lock, produce, unlock, signal(full). Consumer: wait(full), lock, consume, unlock, signal(empty).'),

  q('os_17', 'Operating System', 'Hard',  'What is a TLB and how does it improve memory access performance?',
    'The TLB (Translation Lookaside Buffer) is a fast hardware cache of recent virtual-to-physical page mappings. Without TLB, every memory access requires a page table walk (multiple memory accesses). With TLB, if the mapping is cached (TLB hit), translation is nearly free. TLB miss triggers a page table walk and TLB update. Effective access time = hit rate × hit time + miss rate × page table time.'),

  q('os_18', 'Operating System', 'Medium', 'What are system calls? Give examples.',
    'System calls are the interface between user-space programs and the OS kernel. They allow programs to request privileged operations. Examples: process control (fork, exec, exit), file operations (open, read, write, close), memory management (mmap, brk), device I/O (ioctl), communication (socket, bind, connect).'),

  q('os_19', 'Operating System', 'Easy',  'What is the difference between user mode and kernel mode?',
    'User mode is a restricted CPU mode where programs run; they cannot directly access hardware or protected memory. Kernel mode (privileged mode) has full hardware access. Programs switch to kernel mode via system calls or interrupts. This separation protects the OS and other processes from faulty or malicious programs.'),

  q('os_20', 'Operating System', 'Medium', "What is the Banker's Algorithm?",
    `Banker's Algorithm is a deadlock avoidance algorithm. It models resource allocation by checking whether granting a resource request leaves the system in a "safe state" (a sequence where all processes can finish). If no safe sequence exists after the proposed allocation, the request is denied. It requires knowing maximum resource needs in advance.`),

  q('os_21', 'Operating System', 'Hard',  'What is a file system? How does it organize data?',
    'A file system manages how data is stored and retrieved on storage devices. It organizes data into files and directories using structures like inodes (Unix: stores metadata and block pointers), FAT (File Allocation Table), or NTFS MFT. Key functions: naming, hierarchical directory, free space management, access control, and durability via journaling.'),

  q('os_22', 'Operating System', 'Medium', 'Explain the concept of a critical section and mutual exclusion.',
    'A critical section is code that accesses shared resources and must not be executed by more than one process/thread simultaneously. Mutual exclusion ensures only one thread is in the critical section at a time. Solutions must satisfy: mutual exclusion, progress (no indefinite postponement), and bounded waiting. Implemented with locks, semaphores, or atomic operations.'),

  // ─── Computer Networks ───────────────────────────────────────────────────────
  q('cn_1',  'Computer Networks', 'Easy',   'What is the OSI model? Name its 7 layers.',
    'Physical (bits over medium), Data Link (framing, MAC, error detection), Network (routing, IP), Transport (end-to-end delivery, TCP/UDP), Session (session management), Presentation (encoding, encryption, compression), Application (user-facing protocols: HTTP, DNS, SMTP). Mnemonic: "Please Do Not Throw Sausage Pizza Away."'),

  q('cn_2',  'Computer Networks', 'Easy',   'What is the difference between TCP and UDP?',
    'TCP is connection-oriented (3-way handshake), reliable (acknowledgments, retransmission), ordered, and congestion-controlled; slower but guarantees delivery. UDP is connectionless, unreliable, unordered, and has no flow control; faster and used for real-time applications (video, DNS, gaming).'),

  q('cn_3',  'Computer Networks', 'Easy',   'What is the TCP 3-way handshake?',
    "SYN: client sends a SYN segment with its initial sequence number. SYN-ACK: server responds with SYN+ACK, acknowledging the client's SYN and sending its own. ACK: client sends an ACK. After this, the connection is established and data transfer can begin."),

  q('cn_4',  'Computer Networks', 'Easy',   'What is the difference between HTTP and HTTPS?',
    'HTTP transmits data in plaintext over port 80; susceptible to eavesdropping and MITM attacks. HTTPS is HTTP over TLS/SSL on port 443; encrypts data in transit, authenticates the server via certificates, and ensures data integrity. HTTPS is required for any sensitive data transfer.'),

  q('cn_5',  'Computer Networks', 'Easy',   'What is the purpose of DNS?',
    'DNS (Domain Name System) translates human-readable domain names (e.g., google.com) into IP addresses. It is a hierarchical, distributed database: resolvers query root servers → TLD servers → authoritative name servers. Caching with TTL reduces lookup time. Often called the "phone book of the internet."'),

  q('cn_6',  'Computer Networks', 'Easy',   'What is the difference between a hub, switch, and router?',
    'Hub: layer 1, broadcasts to all ports, creates a single collision domain. Switch: layer 2, forwards frames based on MAC address table to the correct port, reduces collision domains. Router: layer 3, routes packets between different networks using IP addresses and routing tables.'),

  q('cn_7',  'Computer Networks', 'Easy',   'What is NAT (Network Address Translation)?',
    'NAT allows multiple devices on a private network to share a single public IP address. The NAT device (usually a router) replaces private IP:port with the public IP:port in outgoing packets and reverses this for incoming responses. It conserves IPv4 addresses and provides a basic firewall effect.'),

  q('cn_8',  'Computer Networks', 'Medium', 'Explain subnetting. What is a subnet mask?',
    'Subnetting divides a network into smaller logical sub-networks. A subnet mask (e.g., 255.255.255.0 or /24) defines which bits of an IP address identify the network vs. the host. CIDR notation (/24) indicates how many bits are the network prefix. Subnetting improves routing efficiency and network security.'),

  q('cn_9',  'Computer Networks', 'Medium', 'What is a CDN and how does it improve web performance?',
    'A Content Delivery Network is a globally distributed network of servers that cache static content (images, CSS, JS) close to users. Requests are served from the nearest edge node, reducing latency and origin server load. CDNs also provide DDoS protection and high availability through redundancy.'),

  q('cn_10', 'Computer Networks', 'Medium', 'What happens when you type a URL in a browser?',
    'Browser checks DNS cache → OS cache → recursive DNS lookup to get IP. TCP connection: 3-way handshake. TLS handshake (for HTTPS). Browser sends HTTP GET request. Server processes and returns HTML response. Browser parses HTML, fetches sub-resources (CSS, JS, images), executes JavaScript, and renders the page.'),

  q('cn_11', 'Computer Networks', 'Medium', 'What is a firewall? What are the types?',
    'A firewall monitors and filters network traffic based on rules. Types: Packet filter (stateless, checks IP/port headers), Stateful inspection (tracks connection state), Application-layer (deep packet inspection, understands HTTP/DNS), Next-gen firewall (IDS/IPS, SSL inspection). Firewalls can be hardware, software, or cloud-based.'),

  q('cn_12', 'Computer Networks', 'Medium', 'What is the difference between IPv4 and IPv6?',
    'IPv4: 32-bit address space (~4.3 billion addresses), notation like 192.168.1.1, requires NAT to cope with shortage. IPv6: 128-bit address space (~3.4×10³⁸ addresses), notation like 2001:db8::1, built-in IPsec, auto-configuration, no NAT needed, simplified header. IPv6 adoption is growing to address IPv4 exhaustion.'),

  q('cn_13', 'Computer Networks', 'Medium', 'What is ARP (Address Resolution Protocol)?',
    'ARP resolves a known IP address to a MAC address on a local network. The host broadcasts "Who has IP X?" All devices on the subnet receive it; the owner of IP X replies with its MAC address. The requesting host caches the mapping in its ARP table. ARP spoofing is a common MITM attack vector.'),

  q('cn_14', 'Computer Networks', 'Hard',  'Explain TCP congestion control mechanisms.',
    'TCP uses four mechanisms: Slow Start (exponentially increase window from 1 MSS until threshold), Congestion Avoidance (linear increase after threshold), Fast Retransmit (retransmit on 3 duplicate ACKs without waiting for timeout), Fast Recovery (set threshold to half cwnd, avoid slow start). CUBIC and BBR are modern algorithms improving on the original Reno.'),

  q('cn_15', 'Computer Networks', 'Hard',  'What is the difference between SSL and TLS?',
    'SSL (Secure Sockets Layer) is the predecessor of TLS (Transport Layer Security). SSL 3.0 was deprecated due to vulnerabilities (POODLE). TLS 1.2 and 1.3 are the current standards. TLS 1.3 has a faster 1-RTT handshake, removes obsolete ciphers, and provides forward secrecy by default. The term "SSL" is colloquially used but TLS is what is actually deployed.'),

  q('cn_16', 'Computer Networks', 'Hard',  'What is BGP (Border Gateway Protocol)?',
    'BGP is the inter-domain routing protocol of the internet—the "glue" that holds the internet together. It is a path-vector protocol that exchanges routing information between Autonomous Systems (ASes). BGP selects paths based on policies (not just metrics) and attributes like AS-path, local preference, and MED. Security weaknesses: BGP hijacking.'),

  q('cn_17', 'Computer Networks', 'Hard',  'What is a VPN and how does it work?',
    "A VPN (Virtual Private Network) creates an encrypted tunnel between the client and a VPN server, masking the client's IP and encrypting traffic. Protocols: OpenVPN (TLS-based), WireGuard (modern, fast), IPsec/IKEv2, L2TP/IPsec. Used for: secure remote access to corporate networks, bypassing geo-restrictions, and privacy on public Wi-Fi."),

  q('cn_18', 'Computer Networks', 'Medium', 'What is the difference between stateful and stateless protocols?',
    'Stateful protocols maintain session state between requests (e.g., FTP, SSH, TCP). Stateless protocols treat each request independently with no session memory (e.g., HTTP, UDP). HTTP is stateless by design; state is added through cookies, sessions, and tokens. Stateless systems are easier to scale horizontally.'),

  q('cn_19', 'Computer Networks', 'Easy',  'What is a MAC address?',
    'A MAC (Media Access Control) address is a 48-bit hardware identifier assigned to a network interface card (NIC), expressed as 6 hexadecimal octets (e.g., 00:1A:2B:3C:4D:5E). It is used for communication within a local network (Layer 2). Unlike IP addresses, MAC addresses are globally unique and (theoretically) fixed, though they can be spoofed.'),

  q('cn_20', 'Computer Networks', 'Medium', 'What is DHCP?',
    'DHCP (Dynamic Host Configuration Protocol) automatically assigns IP addresses, subnet masks, default gateways, and DNS servers to devices on a network. Process (DORA): Discover (client broadcasts), Offer (server responds), Request (client selects), Acknowledge (server confirms). Without DHCP, each device would need manual IP configuration.'),

  q('cn_21', 'Computer Networks', 'Hard',  'Explain how HTTPS/TLS handshake works.',
    'Client Hello (supported TLS versions, cipher suites, random). Server Hello (chosen cipher, certificate, random). Client verifies certificate against CA. Key Exchange: client generates pre-master secret, encrypts with server public key. Both derive session keys from pre-master + randoms. Finished messages verify handshake integrity. TLS 1.3 reduces this to 1 RTT and uses ephemeral key exchange (ECDHE) for forward secrecy.'),

  q('cn_22', 'Computer Networks', 'Medium', 'What is the difference between TCP/IP and OSI models?',
    'The TCP/IP model has 4 layers: Network Access (=OSI Physical+Data Link), Internet (=OSI Network), Transport, Application (=OSI Session+Presentation+Application). OSI is a conceptual 7-layer model. TCP/IP is the practical model used on the internet. OSI is useful for troubleshooting and understanding protocols at each layer.'),

  // ─── HR ─────────────────────────────────────────────────────────────────────
  q('hr_1',  'HR', 'Easy',   'Tell me about yourself.',
    'Structure: brief professional background → key technical skills → relevant projects or experiences → current goal. Keep it 1-2 minutes. Tailor it to the role: highlight skills most relevant to the job. End by connecting your background to why you are excited about this specific opportunity.'),

  q('hr_2',  'HR', 'Easy',   'Why do you want to work at this company?',
    'Research the company before answering. Mention specific products, values, culture, tech stack, or impact. Show genuine interest: "I admire how your team built X using Y technology. I want to contribute to..." Avoid generic answers like "good salary" or "brand name."'),

  q('hr_3',  'HR', 'Easy',   'What are your strengths?',
    `Pick 2-3 genuine strengths relevant to the role. Back each with a concrete example. Example: "I am strong at breaking down complex problems—I improved our app's load time by 40% by profiling and optimizing a N+1 query issue." Avoid clichés like "I am a perfectionist."`),

  q('hr_4',  'HR', 'Easy',   'What is your greatest weakness?',
    'Be honest but strategic. Name a real weakness you are actively improving. Example: "I used to avoid asking for help when stuck, which cost time. I now set a 30-minute self-solving limit before reaching out, which has improved my productivity." Avoid "I work too hard" or non-answers.'),

  q('hr_5',  'HR', 'Easy',   'Where do you see yourself in 5 years?',
    'Align your answer with realistic career growth in the company. Show ambition but focus on learning and contribution first. Example: "I want to grow into a senior engineer, deepen my system design knowledge, and eventually take on technical leadership of a product area. I see this role as a great foundation for that path."'),

  q('hr_6',  'HR', 'Easy',   'Why are you leaving your current job / why do you want to leave college?',
    'Be honest and positive. Focus on growth: "I am looking for more challenging problems, a stronger engineering culture, or exposure to larger scale systems." For freshers: "I am excited to apply my academic knowledge in a real-world environment and continue learning in a professional team."'),

  q('hr_7',  'HR', 'Easy',   'Do you prefer working alone or in a team?',
    'The best answer shows flexibility. "I enjoy both. I like focused solo work for deep technical problems, but I value collaboration for design decisions and learning from teammates. I find pair programming and code reviews especially valuable for growth."'),

  q('hr_8',  'HR', 'Medium', 'Describe a situation where you worked under pressure.',
    'Use STAR method (Situation, Task, Action, Result). Example: "During our capstone project, our server went down two days before the demo. I quickly diagnosed a memory leak, optimized the code, and redeployed within 6 hours. We delivered on time and the professor highlighted the project as a top submission."'),

  q('hr_9',  'HR', 'Medium', 'Tell me about a time you failed. What did you learn?',
    `Use STAR. Be genuine—don't say "I never failed." Example: "I underestimated the complexity of integrating a third-party API, which delayed our sprint. I learned to always add a research spike before estimating, which I now do consistently. The next two sprints were delivered ahead of schedule."`),

  q('hr_10', 'HR', 'Medium', 'How do you handle disagreements with a teammate?',
    'Emphasize communication and objectivity. "I first try to understand their perspective fully before responding. I focus the discussion on data and trade-offs rather than opinions. If unresolved, I suggest involving a third party or the tech lead. I believe healthy technical disagreement leads to better decisions."'),

  q('hr_11', 'HR', 'Medium', 'What is your approach to learning new technologies?',
    '"I start with the official documentation and a small project. I break the technology into its core concepts and build progressively. I use resources like official docs, conference talks, and open-source code. I also believe in teaching as a way to solidify understanding—I write notes or explain concepts to peers."'),

  q('hr_12', 'HR', 'Medium', 'How do you prioritize tasks when you have multiple deadlines?',
    '"I use a combination of urgency and impact. I list all tasks, estimate their effort and deadline, and communicate early if anything is at risk. I prefer time-blocking for deep work and always communicate proactively with stakeholders before a deadline is missed rather than after."'),

  q('hr_13', 'HR', 'Medium', 'Describe your ideal work environment.',
    "Match it to the company's culture (research before answering). Key elements: clear feedback culture, opportunities to work on challenging problems, autonomy balanced with guidance, collaborative team, and a growth mindset. Avoid asking only about perks or work-life balance—focus on work quality."),

  q('hr_14', 'HR', 'Hard',  'Tell me about your most impactful project.',
    'Use STAR, emphasize your contribution, technical decisions, challenges faced, and measurable impact. Quantify if possible: "reduced API latency by 40%," "served 10k users." Explain what made you choose the approach you did, and what you would do differently. Shows ownership and technical depth.'),

  q('hr_15', 'HR', 'Hard',  'How do you handle receiving critical feedback?',
    '"I try to separate my ego from the work. When I receive critical feedback, I listen fully without interrupting, ask clarifying questions to understand the root concern, and thank the person. I then reflect on whether it is valid and create a concrete action plan to address it. I have found that the most critical feedback is often the most valuable."'),

  q('hr_16', 'HR', 'Hard',  'What are your salary expectations?',
    'Research market rates beforehand using Glassdoor, Levels.fyi, LinkedIn Salary. Give a range based on your research: "Based on my research and the responsibilities of this role, I am looking in the range of X–Y. I am flexible depending on the overall compensation package, growth opportunity, and responsibilities."'),

  q('hr_17', 'HR', 'Medium', 'What are you most proud of in your academic/professional career?',
    'Choose something genuinely meaningful that demonstrates initiative, problem-solving, or leadership. Be specific about your role and the impact. This is a chance to share something that may not appear on your resume—a personal challenge overcome, a team you mentored, or a project that had real-world impact.'),

  q('hr_18', 'HR', 'Easy',  'Do you have any questions for us?',
    'Always prepare 2-3 thoughtful questions. Examples: "What does the onboarding process look like for new engineers?" "What is the biggest technical challenge the team is currently facing?" "What does career growth look like for engineers here?" "How is success measured in the first 6 months?" Avoid asking about salary in the first round.'),

  q('hr_19', 'HR', 'Hard',  'Tell me about a time you led a project or initiative.',
    'Use STAR. Focus on how you organized the team, handled ambiguity, resolved conflicts, and delivered results. Even as a student, this could be a hackathon, club project, or open-source contribution. Show decision-making, communication, and accountability—not just technical execution.'),

  q('hr_20', 'HR', 'Medium', 'How do you stay updated with the latest in technology?',
    '"I follow a set of curated resources: tech blogs (Martin Fowler, High Scalability, Netflix Tech Blog), newsletters (TLDR, Bytes), and conference talks (Google I/O, AWS re:Invent). I also work on side projects to try new tools hands-on. Discussing topics with peers helps me test my understanding and discover new perspectives."'),

  q('hr_21', 'HR', 'Easy',  'What motivates you?',
    'Be genuine and connect it to the role. "I am motivated by solving hard problems that have real impact. Seeing users benefit from something I built is deeply satisfying. I am also motivated by continuous learning—I enjoy the moments when a difficult concept finally clicks and I can apply it effectively."'),

  q('hr_22', 'HR', 'Hard',  'How would you explain a complex technical concept to a non-technical stakeholder?',
    `"I start by understanding what the stakeholder already knows and what decision they need to make. I use analogies, avoid jargon, and focus on the impact rather than the mechanism. I prefer visual aids like simple diagrams. I check for understanding by asking them to restate it or asking if it makes sense. For example, I explained database indexing as a book's index—you look up the term to find the page rather than reading every page."`),
];

export default questions;
