import { Button } from '@/components/atoms';
import { TPhoto } from '@/types';
import { trpc } from '@/utils/trpc';
import NextImage from 'next/image';
import { FC, MouseEventHandler, useEffect, useRef, useState } from 'react';
import { Modal } from '../Modal';

{
  /* I kept the whole buisness logic in the card component for state colocation */
}

type Props = TPhoto;

export const Card: FC<Props> = ({ url: img, photo_id }) => {
  const { mutateAsync, isLoading } = trpc.photos.update.useMutation();

  const [imageLoaded, setImageLoaded] = useState(false);
  const [url, setUrl] = useState(img);
  const [edit, setEdit] = useState(false);
  const [isEdited, setIsEdited] = useState(false);
  const [showCardModal, setShowCardModal] = useState(false);
  const [input, setInput] = useState('');

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const canvasImageRef = useRef<HTMLImageElement>(
    typeof window !== 'undefined' ? new Image() : null
  ); // No need to create the Image Object on every useEffect call.
  const containerRef = useRef<HTMLDivElement>(null);

  const buttonEditText = edit ? 'Save' : 'Edit';
  const buttonRequestText = isLoading ? 'Saving...' : 'Save';

  const onCanvasClick: MouseEventHandler<HTMLCanvasElement> = (event) => {
    if (!imageLoaded) return;
    setIsEdited(true);
    const x = event.nativeEvent.offsetX; // click coords X axis
    const y = event.nativeEvent.offsetY; // click coords Y axis
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext('2d');
    ctx?.clearRect(x, y, 5, 5); // Erase a 10x10 square around the clicked point
  };

  const onEdit = () => {
    setEdit((prevState) => !prevState);
    if (edit && imageLoaded) {
      setImageLoaded(false);
      setUrl(canvasRef.current!.toDataURL('image/webp'));
      document.body.style.overflow = 'scroll';
    } else {
      containerRef.current?.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
        inline: 'center',
      });
      document.body.style.overflow = 'hidden';
    }
  };

  const onRequestEdit = () => setShowCardModal(true);

  const onRequestSubmit = async () => {
    await mutateAsync({ url, photo_id, requestedEdit: input });
    setIsEdited(false);
    setTimeout(() => {
      setShowCardModal(false);
    }, 3000);
  };

  useEffect(() => {
    const image = canvasImageRef.current!;
    image.src = url;
    const canvas = canvasRef.current!;
    function paintImageOnCanvas() {
      if (canvas) {
        const { clientWidth, clientHeight } =
          canvas?.parentNode as HTMLDivElement;
        canvas.width = clientWidth; // width of the container
        canvas.height = clientHeight; // height of the container
        const canvasRatio = canvas.width / canvas.height;
        const imageRatio = image.width / image.height;
        let drawWidth = canvas.width;
        let drawHeight = canvas.height;
        if (canvasRatio > imageRatio) {
          drawWidth = canvas.height * imageRatio;
        } else {
          drawHeight = canvas.width / imageRatio;
        }
        const x = (drawWidth - canvas.width) / 2;
        const y = (drawHeight - canvas.height) / 2;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.imageSmoothingEnabled = false;
          ctx.imageSmoothingQuality = 'high';
          ctx.drawImage(image, -x, -y, drawWidth, drawHeight);
          setImageLoaded(true);
        }
      }
    }
    if (edit) {
      image.crossOrigin = 'anonymous';
      image.addEventListener('load', paintImageOnCanvas);
    }
    return () => {
      image.removeEventListener('load', paintImageOnCanvas);
    };
  }, [edit]);

  return (
    <>
      <div
        ref={containerRef}
        className={`p-4 shadow-md shadow-slate-500/10 rounded-xl bg-white will-change-transform ${
          edit ? 'z-30 shadow-xl' : ''
        }`}
      >
        <div
          className={`relative w-full aspect-video overflow-hidden ${
            edit ? 'border border-indigo-300/30 rounded-xl' : ''
          }`}
        >
          {edit ? (
            <canvas
              ref={canvasRef}
              className="cursor-pointer"
              onClick={onCanvasClick}
            />
          ) : (
            <NextImage
              src={url}
              alt={`img_${photo_id}`}
              fill
              sizes="100vw"
              crossOrigin="anonymous"
              className="object-center w-full h-full object-contain" // setting this to object-fit:contain so that the original aspect ratio of the image is maintained
            />
          )}
        </div>
        <div className="space-x-4 flex mt-6 w-[55%] mx-auto">
          <Button
            className="flex-1"
            size={'full'}
            onClick={onEdit}
            variant={edit ? 'ghost-amber' : 'ghost-indigo'}
          >
            {buttonEditText}
          </Button>
          <Button
            className="flex-1"
            size={'full'}
            onClick={onRequestEdit}
            disabled={edit || !isEdited}
            title="Enable this by editing"
          >
            Request Edit
          </Button>
        </div>
      </div>
      {edit && (
        <div className="fixed w-screen h-screen top-0 left-0 bg-black/50 z-20" />
      )}
      <Modal show={showCardModal} onCloseModal={() => setShowCardModal(false)}>
        <Modal.Header>
          <h1 className="text-center text-lg">What you wanna change ?</h1>
        </Modal.Header>
        <Modal.Body>
          <input
            name="edited_message"
            type="text"
            className="w-full focus:outline-none p-3 rounded-xl text-sm placeholder:text-slate-300 bg-slate-100"
            placeholder="Deleted pixels by the top edg..."
            value={input}
            onChange={(eve) => setInput(eve.target.value)}
          />
        </Modal.Body>
        <Modal.Footer>
          <Button
            disabled={input.trim() === ''}
            className="mx-auto"
            onClick={onRequestSubmit}
          >
            {buttonRequestText}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

Card.displayName = 'Card';
