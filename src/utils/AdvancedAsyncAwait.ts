class AdvancedAsyncAwait {

  private ids = [ 0, 1, 2, 3, 4, 5, 6, 7, 8, 9 ];

  getPost = async (id: number) =>
    // eslint-disable-next-line no-return-await
    await (await fetch(`https://jsonplaceholder.typicode.com/posts/${id}`)).json();

  getPostsSerialized = async (ids: number[]) => {

    await ids.reduce(async (acc: Promise<void>, id: number) => {
      // waits for the previous item to complete
      await acc;
      // get the next item
      const post = await this.getPost(id);
      // eslint-disable-next-line no-console
      console.log(post);
    }, Promise.resolve());

    // for (const id of ids) {
    //   const data = await this.getPost(id);
    //   console.log(data);
    // }
    // eslint-disable-next-line no-console
    console.log(`I'll wait on you`);
  };

  getPostsConcurrently = async (ids: number[]) => {
    const posts = await Promise.all(ids.map(async (id) => this.getPost(id)));
    // eslint-disable-next-line no-console
    console.log('posts', posts);
    // eslint-disable-next-line no-console
    console.log(`I'll wait on you`);
  };

}

export default AdvancedAsyncAwait;
