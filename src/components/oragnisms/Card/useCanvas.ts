import {
  Dispatch,
  MouseEventHandler,
  RefObject,
  SetStateAction,
  useEffect,
  useRef,
  useState,
} from 'react';

interface THookArgs {
  img: string;
}

type HookReturnType = [
  boolean,
  string,
  RefObject<HTMLCanvasElement>,
  RefObject<HTMLDivElement>,
  () => void,
  MouseEventHandler<HTMLCanvasElement>,
  boolean,
  Dispatch<SetStateAction<boolean>>
];

export const useCanvas = ({ img }: THookArgs): HookReturnType => {
  const [edit, setEdit] = useState(false);
  const [isEdited, setIsEdited] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [url, setUrl] = useState(img);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const canvasImageRef = useRef<HTMLImageElement>(
    typeof window !== 'undefined' ? new Image() : null
  ); // No need to create the Image Object on every useEffect call.
  const containerRef = useRef<HTMLDivElement>(null);

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

  const onCanvasClick: MouseEventHandler<HTMLCanvasElement> = (event) => {
    if (!imageLoaded) return;
    setIsEdited(true);
    const x = event.nativeEvent.offsetX; // click coords X axis
    const y = event.nativeEvent.offsetY; // click coords Y axis
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext('2d');
    ctx?.clearRect(x, y, 5, 5); // Erase a 10x10 square around the clicked point
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

  return [
    edit,
    url,
    canvasRef,
    containerRef,
    onEdit,
    onCanvasClick,
    isEdited,
    setIsEdited,
  ];
};
