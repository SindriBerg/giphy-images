/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMemo, useState } from 'react'
import { useQuery } from '@tanstack/react-query';

const buildQuery = (searchQuery: string, page: number, limit: number) => {
  return ['searchQuery', searchQuery, page, limit] as const;
}

const ImageComponent = ({ url, imageText, textPosition }: { url: string; imageText: string; textPosition: Record<string, string | undefined> }) => {
  return (
    <div
      style={{
        position: 'relative',
      }}>
      <img src={url} />
      <span style={{
        position: 'absolute',
        ...textPosition,
      }}>
        {imageText}
      </span>
    </div>
  );
};

const Images = ({ searchQuery, imageText, textPosition }: { searchQuery: string, imageText: string; textPosition: Record<string, string | undefined> }) => {
  const query = useQuery({
    queryKey: buildQuery(searchQuery, 0, 3), queryFn: async ({ queryKey: [_, query, page, limit] }) => {
      console.log('test');
      const data = await fetch(`https://api.giphy.com/v1/stickers/search?q=${query}&limit=${limit}&rating=g&api_key=1bkG7ky5cmw5SLyvNfElcR1iYVzs38Zq`);
      return await data.json();
    }
  });

  if (query.isLoading) return <div>Loading...</div>;

  const imageUrls = query.data?.data.flatMap((d: any) => d.images.downsized_medium.url) || [];

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'row',
    }}>
      {imageUrls.map((url: string) => <ImageComponent imageText={imageText} url={url} textPosition={textPosition} />)}
    </div>
  );
}


function App() {
  const [searchQuery, setSearchQuery] = useState('');
  const [imageText, setImageText] = useState('');
  const [selectedPosition, setSelectedPosition] = useState('center top');
  const determinedPosition = useMemo(() => {
    switch (selectedPosition) {
      case 'center top':
        return { top: '0', left: '50%', transform: 'translate(-50%, -50%)' };
      case 'center bottom':
        return { bottom: '0', left: '50%', transform: 'translate(-50%, 50%)' };
      case 'below image':
        return { bottom: '-50px', left: '50%', transform: 'translate(-50%, 0)' };
      default:
        return { top: '50%', left: '50%', transform: 'translate(-50%, -50%)' };
    }
  }, [selectedPosition]);

  return (
    <div className="App">
      <input type="text" onChange={(e) => setSearchQuery(e.target.value)} />
      <input type="text" onChange={(e) => setImageText(e.target.value)} />
      <select onChange={(e) => setSelectedPosition(e.target.value)}>
        <option value="center top">Center Top</option>
        <option value="center bottom">Center Bottom</option>
        <option value="below image">Below Image</option>
      </select>
      <Images searchQuery={searchQuery} imageText={imageText} textPosition={determinedPosition} />
    </div>
  );
}

export default App;
