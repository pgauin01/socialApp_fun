let db = {
  users: [
    {
      userId: "wdkmcmmcmmcwmckc",
      email: "user@email.com",
      handle: "user",
      createdAt: "2020-07-30T15:11:50.278Z",
      imageUrl: "images/fnvfnddc.jpg",
      bio: "hi there!",
      website: "user@dec.co",
      location: "London,uk",
    },
  ],
  screams: [
    {
      userHandle: "user",
      body: "this is scream",
      createdAt: "2020-07-30T15:11:50.278Z",
      likeCount: "5",
      commentcount: "10",
    },
  ],
  comments: [
    {
      userHandle: "user",
      screamId: "ddkkddmdmm",
      body: "hi there",
      createdAt: "2020-07-30T15:11:50.278Z",
    },
  ],
  notifications: [
    {
      recipient: "user",
      sender: "john",
      read: "true | false",
      screamId: "dmkvmdvvmdkmv",
      type: "like | comment",
      createdAt: "2020-07-30T15:11:50.278Z",
    },
  ],
};

const userDetails = {
  //Redux state
  credentials: {
    userId: "dnjvnddnndvj",
    email: "user@email.com",
    handle: "user",
    createdAt: "2020-07-30T15:11:50.278Z",
    imageUrl: "images/fnvfnddc.jpg",
    bio: "hi there!",
    website: "user@dec.co",
    location: "London,uk",
  },
  likes: [
    {
      userHandle: "user",
      screamId: "fhfhfhfhh",
    },
    {
      userHandle: "user",
      screamId: "fhfhfhfhh",
    },
  ],
};
