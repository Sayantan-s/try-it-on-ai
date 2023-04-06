import { Button } from '@/components/atoms';
import { useHandleInput } from '@/hooks';
import { TPhoto } from '@/types';
import { trpc } from '@/utils/trpc';
import NextImage from 'next/image';
import { FC, Fragment, useState } from 'react';
import { Modal } from '../Modal';
import { useCanvas } from './useCanvas';

// I kept the whole buisness logic in the card component for state colocation

type Props = TPhoto;

export const Card: FC<Props> = ({ url: img, photo_id }) => {
  const { mutateAsync, isLoading } = trpc.photos.update.useMutation();
  const [
    edit,
    url,
    canvasRef,
    containerRef,
    onEdit,
    onCanvasClick,
    isEdited,
    setIsEdited,
  ] = useCanvas({ img });

  const [showCardModal, setShowCardModal] = useState(false);
  const [input, handleInput] = useHandleInput('');

  const buttonEditText = edit ? 'Save' : 'Edit';
  const buttonRequestText = isLoading ? 'Saving...' : 'Save';

  const onRequestEdit = () => setShowCardModal(true);

  const onRequestSubmit = async () => {
    await mutateAsync({ url, photo_id, requestedEdit: input });
    setIsEdited(false);
    setShowCardModal(false);
  };

  return (
    <Fragment>
      <div
        ref={containerRef}
        className={`p-4 shadow-slate-500/10 rounded-xl bg-white will-change-transform ${
          edit ? 'z-30 shadow-xl' : 'shadow-md'
        }`}
      >
        <div
          className={`relative w-full aspect-[16/10] overflow-hidden ${
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
              sizes="(max-width: 768px) 100vw,
              (max-width: 1200px) 50vw,
              33vw"
              crossOrigin="anonymous"
              className="object-center w-full h-full object-contain" // setting this to object-fit:contain so that the original aspect ratio of the image is maintained
            />
          )}
        </div>
        <div className="space-x-4 flex mt-6 md:w-[80%] lg:w-[60%] w-full mx-auto">
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
            onChange={handleInput}
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
    </Fragment>
  );
};
