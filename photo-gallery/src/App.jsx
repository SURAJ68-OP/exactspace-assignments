import React, { useState, useEffect, useRef, useCallback } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faThumbsUp } from '@fortawesome/free-solid-svg-icons'
import './App.css';

function App() {
  const [photos, setPhotos] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  // Object to store like counts independently of the fetched data array
  const [likes, setLikes] = useState({});

  const observer = useRef();
  const lastPhotoElementRef = useCallback(node => {
    if (loading) return;
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        setPage(prevPage => prevPage + 1);
      }
    });
    if (node) observer.current.observe(node);
  }, [loading, hasMore]);

  useEffect(() => {
    setLoading(true);
    fetch(`https://picsum.photos/v2/list?page=${page}&limit=10`)
      .then(res => res.json())
      .then(data => {
        if (data.length === 0) {
          setHasMore(false);
        } else {
          setPhotos(prevPhotos => {
            // Filter out potential duplicates if API returns overlapping data
            const existingIds = new Set(prevPhotos.map(p => p.id));
            const newPhotos = data.filter(p => !existingIds.has(p.id));
            return [...prevPhotos, ...newPhotos];
          });
        }
        setLoading(false);
      })
      .catch(e => {
        console.error("Error fetching data", e);
        setLoading(false);
      });
  }, [page]);

  const handleLike = (id) => {
    setLikes(prev => ({
      ...prev,
      [id]: (prev[id] || 0) + 1
    }));
  };

  return (
    <div className="gallery-container">
      <h1 className="gallery-header">Photo gallery</h1>
      {photos.map((photo, index) => {
        if (photos.length === index + 1) {
          return (
            <div ref={lastPhotoElementRef} key={photo.id} className="photo-item">
              <img src={photo.download_url} alt={`By ${photo.author}`} />
              <div className="photo-details">
                 <span>Author: {photo.author}</span>
                 <button className="like-btn" onClick={() => handleLike(photo.id)}>
                   <FontAwesomeIcon icon={faThumbsUp} /> {likes[photo.id] || 0}
                 </button>
              </div>
            </div>
          );
        } else {
          return (
             <div key={photo.id} className="photo-item">
              <img src={photo.download_url} alt={`By ${photo.author}`} />
              <div className="photo-details">
                 <span>Author: {photo.author}</span>
                 <button className="like-btn" onClick={() => handleLike(photo.id)}>
                   <FontAwesomeIcon icon={faThumbsUp} /> {likes[photo.id] || 0}
                 </button>
              </div>
            </div>
          );
        }
      })}
      {loading && <div>Loading more photos...</div>}
    </div>
  );
}

export default App;