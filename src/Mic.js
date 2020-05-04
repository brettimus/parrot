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
      console.log('yo?', funUrl)
      srcMemo.current = funUrl
      setMeh(meh => meh + 1);
    }
    return () => {
      if (!blobURL && srcMemo.current) {
        URL.revokeObjectURL(srcMemo.current)
      }
    }
  }, [blob, blobURL, srcMemo])
  console.log('srcMemo.current', srcMemo.current)
  return (
    <React.Fragment>
      <div>{formatRelative(new Date(timestamp), new Date())}</div>
      <audio controls src={srcMemo.current} />
      <button onClick={remove} type="button">Remove</button>
    </React.Fragment>
  );
};

export const Mic = (props) => {
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
            <p>Last try:</p>
            <Attempt {...lastTry} remove={() => setLastTry(null)} />
            <button onClick={saveLastTry} type="button">Save</button>
          </React.Fragment>
        )
      }
      <div style={{ marginTop: '4em' }}/>
      {
        loading && <p>Loading your practice clips...</p>
      }
      {
        !loading && (
          <React.Fragment>
            <p>All Yo Attempts</p>
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
