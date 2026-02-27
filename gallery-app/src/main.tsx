import React from 'react';
import ReactDOM from 'react-dom/client';
import InfiniteGallery from './components/ui/3d-gallery-photography';

// Use Antik's actual photography images from the static site
const photographyImages = [
  { src: '/assets/images/optimized/DSC_0065-02-01.webp', alt: 'Photography 1' },
  { src: '/assets/images/optimized/DSC_0174-01-01.webp', alt: 'Photography 2' },
  { src: '/assets/images/optimized/DSC_0175-01.webp', alt: 'Photography 3' },
  { src: '/assets/images/optimized/DSC_0205-01-01.webp', alt: 'Photography 4' },
  { src: '/assets/images/optimized/DSC_0315-02.webp', alt: 'Photography 5' },
  { src: '/assets/images/optimized/DSC_0501.webp', alt: 'Photography 6' },
  { src: '/assets/images/optimized/DSC_0536.webp', alt: 'Photography 7' },
  { src: '/assets/images/optimized/DSC_0712.webp', alt: 'Photography 8' },
  { src: '/assets/images/optimized/DSC_0845.webp', alt: 'Photography 9' },
  { src: '/assets/images/optimized/DSC_0943-01.webp', alt: 'Photography 10' },
  { src: '/assets/images/optimized/DSC_0946.webp', alt: 'Photography 11' },
  { src: '/assets/images/optimized/DSC_0960.webp', alt: 'Photography 12' },
  { src: '/assets/images/optimized/DSC_1015-01.webp', alt: 'Photography 13' },
  { src: '/assets/images/optimized/DSC_1035-01.webp', alt: 'Photography 14' },
  { src: '/assets/images/optimized/DSC_1081-01.webp', alt: 'Photography 15' },
  { src: '/assets/images/optimized/DSC_1087-01.webp', alt: 'Photography 16' },
];

function GalleryWidget() {
  return (
    <InfiniteGallery
      images={photographyImages}
      speed={1.2}
      zSpacing={3}
      visibleCount={12}
      falloff={{ near: 0.8, far: 14 }}
      className="w-full"
      style={{ height: '100%' }}
    />
  );
}

// Mount to the gallery-3d div in the static site
const root = document.getElementById('gallery-3d');
if (root) {
  ReactDOM.createRoot(root).render(
    <React.StrictMode>
      <GalleryWidget />
    </React.StrictMode>
  );
}
