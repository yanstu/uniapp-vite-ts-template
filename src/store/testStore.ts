import { defineStore } from 'pinia';

interface IUser {
  id: number;
}

const users: IUser[] = [];

export const useStore = defineStore('main', {
  state: () => ({
    users,
  }),
  getters: {
    getUserById: (state) => {
      return (userId: number) => state.users.find((user) => user.id === userId);
    },
  },
  actions: {
    async change() {
      console.log(1);
      const sleep = (delay: number) =>
        new Promise((resolve) => setTimeout(resolve, delay));
      await sleep(3000);
      console.log(2);
      this.$patch((state) => {
        state.users = [
          {
            id: 2,
          },
        ];
      });
    },
  },
});
