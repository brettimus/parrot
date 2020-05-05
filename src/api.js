import Dexie from 'dexie';

global.Dexie = Dexie;
global.startOver = () => Dexie.delete("ParrotDatabase")

const db = new Dexie("ParrotDatabase");
db.version(1).stores({
  mimics: "++id,timestamp,mediaId",
  media: "++id,title,description",
});

export const loadMedia = () => {
  return db.transaction('r', db.media, async () => {
    const samples = await db.media.toArray();
    return samples[0];
  });
}

export const saveMedia = ({ blob, title, description }) => {
  return db.transaction('rw', db.media, async () => {
    const id = await db.media.add({ title, description, blob });
    console.debug(`Added media with id ${id}`, { title, description, blob });
    return id;
  });
}

export const loadMimics = (mediaId) => new Promise((res, rej) => {
  db.transaction('r', db.mimics, async () => {
    const getAll = () => {
      let recs = db.mimics.where("timestamp").below(new Date());
      if (mediaId) {
        recs = recs.and().where("mediaId").equals(mediaId);
      }
      return recs.toArray();
    };

    const allRecordings = await getAll();
    console.debug("My recordings", allRecordings);
    res(allRecordings);
  }).catch(e => {
    console.error(e.stack || e);
    rej(e);
  });
});

export const addMimic = (micData, mediaId) => {
  const { blob, timestamp } = micData;
  console.log('Adding mic data...', micData, { blob, timestamp })
  return db.transaction('rw', db.mimics, async () => {
    const id = await db.mimics.add({ timestamp, blob });
    return id;
  }).catch(e => {
      alert(e.stack || e);
  });
};

export const deleteAllMimics = () => {
  return db.mimics.clear();
};

export const deleteMimic = (key) => {
  return db.mimics.delete(key);
};
