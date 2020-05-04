import Dexie from 'dexie';

const db = new Dexie("ParrotDatabase");
db.version(1).stores({ mimics: "++id,timestamp,blob" });

export const loadMimics = () => new Promise((res, rej) => {
  db.transaction('r', db.mimics, async () => {
    const allRecordings = await db.mimics.where("timestamp").below(new Date()).toArray();
    console.debug("My recordings", allRecordings);
    res(allRecordings);
  }).catch(e => {
    console.error(e.stack || e);
    rej(e);
  });
});

export const addMimic = (micData) => {
  const { blob, timestamp } = micData;
  console.log('Adding mic data...', micData, { blob, timestamp })
  return db.transaction('rw', db.mimics, async () => {
    const id = await db.mimics.add({ timestamp, blob });
    alert (`Added mimic with id ${id}`);
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
