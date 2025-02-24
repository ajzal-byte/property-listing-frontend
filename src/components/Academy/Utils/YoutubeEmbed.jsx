const extractVideoId = (url) => {
    const match = url.match(
      /(?:youtu\.be\/|youtube\.com\/(?:.*v=|.*\/|.*embed\/|.*v\/))([^?&]+)/ 
    );
    return match ? match[1] : null;
  };
  
  const YouTubeEmbed = ({ url }) => {
    const videoId = extractVideoId(url);
  
    if (!videoId) return <p className="text-red-500">Invalid YouTube URL</p>;
  
    return (
      <div className="w-full aspect-w-16 h-130">
        <iframe
          className="w-full h-full"
          src={`https://www.youtube.com/embed/${videoId}`}
          title="YouTube Video"
          frameBorder="0"
          allowFullScreen
        />
      </div>
    );
  };
  
  export default YouTubeEmbed