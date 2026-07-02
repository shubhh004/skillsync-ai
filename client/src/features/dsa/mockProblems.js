const mockProblems = [
  { id: 1,  title: 'Two Sum',                          platform: 'LeetCode',      topic: 'Array',               difficulty: 'Easy',   status: 'Solved',    link: '#', notes: 'Use hash map for O(n) solution'           },
  { id: 2,  title: 'Best Time to Buy and Sell Stock',  platform: 'LeetCode',      topic: 'Array',               difficulty: 'Easy',   status: 'Solved',    link: '#', notes: 'Track min price, scan once'               },
  { id: 3,  title: 'Valid Parentheses',                platform: 'LeetCode',      topic: 'Stack',               difficulty: 'Easy',   status: 'Solved',    link: '#', notes: 'Push open, pop and check on close'        },
  { id: 4,  title: 'Climbing Stairs',                  platform: 'LeetCode',      topic: 'Dynamic Programming', difficulty: 'Easy',   status: 'Solved',    link: '#', notes: 'Fibonacci pattern'                         },
  { id: 5,  title: 'Reverse Linked List',              platform: 'LeetCode',      topic: 'Linked List',         difficulty: 'Easy',   status: 'Solved',    link: '#', notes: 'Iterative and recursive both work'         },
  { id: 6,  title: 'Maximum Subarray',                 platform: 'LeetCode',      topic: 'Dynamic Programming', difficulty: 'Medium', status: 'Solved',    link: '#', notes: "Kadane's algorithm"                       },
  { id: 7,  title: 'LRU Cache',                        platform: 'LeetCode',      topic: 'Design',              difficulty: 'Medium', status: 'Solved',    link: '#', notes: 'HashMap + Doubly Linked List'              },
  { id: 8,  title: 'Binary Tree Level Order Traversal',platform: 'LeetCode',      topic: 'Binary Tree',         difficulty: 'Medium', status: 'Solved',    link: '#', notes: 'BFS with queue'                           },
  { id: 9,  title: 'Number of Islands',                platform: 'LeetCode',      topic: 'Graph',               difficulty: 'Medium', status: 'Solved',    link: '#', notes: 'DFS or BFS flood fill'                    },
  { id: 10, title: 'Merge Intervals',                  platform: 'LeetCode',      topic: 'Array',               difficulty: 'Medium', status: 'Attempted', link: '#', notes: 'Sort by start, then merge overlapping'     },
  { id: 11, title: 'Course Schedule',                  platform: 'LeetCode',      topic: 'Graph',               difficulty: 'Medium', status: 'Attempted', link: '#', notes: 'Cycle detection via DFS / topological sort' },
  { id: 12, title: 'Word Break',                       platform: 'GeeksForGeeks', topic: 'Dynamic Programming', difficulty: 'Medium', status: 'Todo',      link: '#', notes: ''                                         },
  { id: 13, title: 'Trapping Rain Water',              platform: 'LeetCode',      topic: 'Two Pointer',         difficulty: 'Hard',   status: 'Solved',    link: '#', notes: 'Two pointer O(n) approach'                 },
  { id: 14, title: 'Merge K Sorted Lists',             platform: 'LeetCode',      topic: 'Heap',                difficulty: 'Hard',   status: 'Attempted', link: '#', notes: 'Min heap of size k'                        },
  { id: 15, title: 'Median of Two Sorted Arrays',      platform: 'LeetCode',      topic: 'Binary Search',       difficulty: 'Hard',   status: 'Todo',      link: '#', notes: ''                                         },
];

export default mockProblems;
