interface User {
  id: number;
  name: string;
  email: string;
}

const users: User[] = [
  { id: 1, name: "John Doe", email: "john.doe@example.com" },
  { id: 2, name: "Jane Smith", email: "jane.smith@example.com" },
];

export const userService = {
  getAllUsers: async (): Promise<User[]> => {
    return users;
  },

  getUserById: async (id: number): Promise<User | null> => {
    const user = users.find((user) => user.id === id);
    return user || null;
  },

  createUser: async (userData: Omit<User, "id">): Promise<User> => {
    const newUser: User = {
      id: users.length > 0 ? (users[users.length - 1]?.id ?? 0) + 1 : 1,
      ...userData,
    };
    users.push(newUser);
    return newUser;
  },

  updateUser: async (
    id: number,
    userData: Partial<Omit<User, "id">>,
  ): Promise<User | null> => {
    const userIndex = users.findIndex((user) => user.id === id);
    if (userIndex === -1) {
      return null;
    }
    users[userIndex] = { ...users[userIndex], ...userData } as User;
    return users[userIndex];
  },

  deleteUser: async (id: number): Promise<boolean> => {
    const userIndex = users.findIndex((user) => user.id === id);
    if (userIndex === -1) {
      return false;
    }
    users.splice(userIndex, 1);
    return true;
  },
};
