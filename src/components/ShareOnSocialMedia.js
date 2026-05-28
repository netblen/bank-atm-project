import React from 'react';

const ShareOnSocialMedia = () => {
  const shareMessage = "Check out my experience!";
  const urlToShare = "https://yourwebsite.com";

  const handleShare = (platform) => {
    let shareUrl = '';
    switch (platform) {
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(urlToShare)}&quote=${encodeURIComponent(shareMessage)}`;
        break;
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(urlToShare)}&text=${encodeURIComponent(shareMessage)}`;
        break;
      case 'pinterest':
        shareUrl = `https://pinterest.com/pin/create/button/?url=${encodeURIComponent(urlToShare)}&media=&description=${encodeURIComponent(shareMessage)}`;
        break;
      default:
        break;
    }
    window.open(shareUrl, '_blank'); 
  };

  return (
    <div className="share-buttons">
      <h3>Share with Friends</h3>
      <button onClick={() => handleShare('facebook')}>Share on Facebook</button>
      <button onClick={() => handleShare('twitter')}>Share on X (Twitter)</button>
      <button onClick={() => handleShare('pinterest')}>Share on Pinterest</button>
    </div>
  );
};

export default ShareOnSocialMedia;
