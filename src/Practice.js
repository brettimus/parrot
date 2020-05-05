import React, { useState, useEffect } from 'react';
import { ReactMic } from 'react-mic';
import { formatRelative } from 'date-fns'

import * as api from './api';

const Attempt = ({ timestamp, blob, blobURL, remove }) => {
  const srcMemo = React.useRef(blobURL || null);
  const [meh, setMeh] = React.useState(0);
  useEffect(() => {
    if (!srcMemo.current) {
      const funUrl = URL.createObjectURL(blob)
      srcMemo.current = funUrl
      setMeh(meh => meh + 1);
    }
    return () => {
      if (!blobURL && srcMemo.current) {
        URL.revokeObjectURL(srcMemo.current)
      }
    }
  }, [blob, blobURL, srcMemo])
  return (
    <React.Fragment>
      <div>{formatRelative(new Date(timestamp), new Date())}</div>
      <audio controls src={srcMemo.current} />
      <button onClick={remove} type="button">Remove</button>
    </React.Fragment>
  );
};

export const Mimics = (props) => {
  const [loading, setLoading] = useState(false);
  const [recording, setRecording] = useState(false);
  const [lastTry, setLastTry] = useState(null);
  const [history, setHistory] = useState([]);

  useEffect(() => {
    setLoading(true);
    api.loadMimics().then(mimics => {
      setHistory(ms => [...ms, ...mimics]);
      setLoading(false);
    }, error => {
      global.alert('oh no.');
    })
  }, [setLoading])

  const saveLastTry = () => {
    setHistory(savedRecs => [lastTry, ...savedRecs]);
    setLastTry(null);
    api.addMimic(lastTry);
  }

  const startRecording = () => {
    setRecording(true);
    if (lastTry) {
      saveLastTry(); 
    }
  };

  const stopRecording = () => {
    setRecording(false);
  };

  const onData = (recordedBlob) => {
    console.log('chunk of real-time data is: ', recordedBlob);
  }

  const onStop = (recordedBlob) => {
    console.log('recordedBlob is: ', recordedBlob);
    setLastTry({
      ...recordedBlob,
      timestamp: recordedBlob.startTime
    });
  }

  const deleteAll = () => {
    api.deleteAllMimics();
    setHistory([]);
  };

  return (
    <div>
      <h2>Mimics</h2>
      <ReactMic
        record={recording}
        className="sound-wave"
        onStop={onStop}
        onData={onData}
        strokeColor="#3B1C32"
        backgroundColor="#ca054d" />
      <br />
      <button onClick={startRecording} type="button">Start</button>
      <button onClick={stopRecording} type="button">Stop</button>
      {
        lastTry && (
          <React.Fragment>
            <hr />
            <p>Last Mimic:</p>
            <Attempt {...lastTry} remove={() => setLastTry(null)} />
            <button onClick={saveLastTry} type="button">Save</button>
          </React.Fragment>
        )
      }
      <div style={{ marginTop: '3em' }}/>
      {
        loading && <p>Loading your practice clips...</p>
      }
      {
        !loading && (
          <React.Fragment>
            <p>Ye Olde Mimickse</p>
            <button onClick={deleteAll} type="button">Delete All</button>
            <ul>
              {history.map((h, i) => {
                return (
                  <li key={i} style={{padding: '1em'}}>
                    <Attempt {...h} remove={() =>  {
                        api.deleteMimic(h.id);
                        setHistory(hs => {
                          return hs.filter(oh => oh.id !== h.id)
                        });
                    }} />
                  </li>
                );
              })}
            </ul>
          </React.Fragment>
        )
      }
    </div>
  );
}

export const Preview = () => {
  const [sample, setSample] = useState(null);
  const setSampleWrapper = React.useCallback(newSample => {
    return setSample({
      ...newSample,
      src: URL.createObjectURL(newSample.blob)
    })
  }, [setSample])
  useEffect(() => {
    api.loadMedia().then(thing => {
      if (thing) {
        setSampleWrapper(thing)
      }
    })
  }, [setSampleWrapper])

  if (sample) {
    return (
      <div>
        <h2>Okay Try Mimicing This or Whatever</h2>
        <audio controls src={sample.src} />
      </div>
    );
  }

  const onInputChange = (event) => {
    const file = event.target.files[0]; 
    const toCommit = {
      title: file.name || 'untitled',
      description: 'TODO',
      blob: file,
    }
    api.saveMedia(toCommit).then(id => {
      setSampleWrapper({
        ...toCommit,
        id
      });      
    })
  }
  return (
    <div>
      <h2>Upload a File You Can Mimic</h2>
      <input id="sample" name="sample" type="file" onChange={onInputChange} style={{ width: '180px' }} />
    </div>
  );
}

export const Practice = () => {
  return (
    <React.Fragment>
      <div style={{ padding: '2em' }}>
        <Preview />
      </div>
      <Mimics />
    </React.Fragment>
  );
};

export default Practice;