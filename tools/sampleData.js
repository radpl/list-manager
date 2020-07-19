const lists = [
  {
    id: 1,
    title: "Example",
    columns: [{ columnId: 1, columnName: 'text' }]
  }
];

const entries = [
  {
    listId: 1,
    id: 1,
    text: 'Element 1',
    level: 0,
    parentId: null,
    rootParentId: null,
    path: [1],
    pathToParent: null,
    children: [2],
    visible: true,
    ec: 'expanded'
  },
  {
    listId: 1,
    id: 2,
    text: 'Element 2',
    level: 1,
    parentId: 1,
    rootParentId: [1],
    path: [1, 2],
    pathToParent: [1],
    children: [],
    visible: true
  },
  {
    listId: 1,
    id: 3,
    text: 'Element 3',
    level: 0,
    parentId: null,
    rootParentId: null,
    path: [3],
    pathToParent: null,
    children: [],
    visible: true
  },
  {
    listId: 1,
    id: 4,
    text: 'Element 4',
    level: 0,
    parentId: null,
    rootParentId: null,
    path: [4],
    pathToParent: null,
    children: [],
    visible: true
  },
  {
    listId: 1,
    id: 5,
    text: 'Element 5',
    level: 0,
    parentId: null,
    rootParentId: null,
    path: [5],
    pathToParent: null,
    children: [],
    visible: true
  },
  {
    listId: 1,
    id: 6,
    text: 'Element 6',
    level: 0,
    parentId: null,
    rootParentId: null,
    path: [6],
    pathToParent: null,
    children: [],
    visible: true
  },
  {
    listId: 1,
    id: 7,
    text: 'Element 7',
    level: 0,
    parentId: null,
    rootParentId: null,
    path: [7],
    pathToParent: null,
    children: [],
    visible: true
  },
  {
    listId: 1,
    id: 8,
    text: 'Element 8',
    level: 0,
    parentId: null,
    rootParentId: null,
    path: [8],
    pathToParent: null,
    children: [],
    visible: true
  },
  {
    listId: 1,
    id: 9,
    text: 'Element 9',
    level: 0,
    parentId: null,
    rootParentId: null,
    path: [9],
    pathToParent: null,
    children: [],
    visible: true
  },
  {
    listId: 1,
    id: 10,
    text: 'Element 10',
    level: 0,
    parentId: null,
    rootParentId: null,
    path: [10],
    pathToParent: null,
    children: [],
    visible: true
  },
];

const newList = {
  id: null,
  title: ""
};

const newEntry = {
  id: null,
  level: 0,
  parentId: null,
  rootParentId: null,
  path: null,
  pathToParent: null,
  children: [],
  visible: true
};

module.exports = {
  newList,
  newEntry,
  lists,
  entries
};
