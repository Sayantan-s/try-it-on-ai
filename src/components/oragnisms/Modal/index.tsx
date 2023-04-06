import {
  FC,
  FormEvent,
  FormEventHandler,
  MutableRefObject,
  PropsWithChildren,
  useEffect,
  useRef,
  useState,
} from 'react';
import { createPortal } from 'react-dom';

interface Props {
  show: boolean;
  onCloseModal: () => void;
  onSubmit?: (eve: FormEvent<Element>) => void;
  children: React.ReactNode;
}

const Root: FC<Props> = ({ show, onCloseModal, onSubmit, children }) => {
  const ref = useRef<HTMLDialogElement>(null);
  const containerRef = useRef<HTMLDivElement>(
    null
  ) as MutableRefObject<HTMLDivElement>;

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    containerRef.current = document.getElementById('modals') as HTMLDivElement;
    setMounted(true);
  }, []);

  useEffect(() => {
    if (show) ref.current?.showModal();
    else ref.current?.close();
  }, [show]);

  const handleSubmit: FormEventHandler = (eve) => {
    eve.preventDefault();
    onSubmit?.(eve);
  };

  return mounted && containerRef.current
    ? createPortal(
        show ? (
          <dialog
            ref={ref}
            className="relative z-40 backdrop:blur-sm p-6 rounded-xl shadow-slate-950/20 backdrop:bg-slate-950/50 backdrop:backdrop-blur-xl w-full max-w-md aspect-video flex justify-center items-center flex-col"
          >
            <button
              className="w-6 h-6 absolute top-2 right-2 bg-rose-50 hover:bg-rose-100 flex items-center justify-center rounded-full"
              onClick={onCloseModal}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-4 h-4"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                  className="stroke-rose-500 store-2"
                />
              </svg>
            </button>
            <form action="dialog" className="w-full" onSubmit={handleSubmit}>
              {children}
            </form>
          </dialog>
        ) : null,
        document.getElementById('modals') as HTMLElement
      )
    : null;
};

const Header: FC<PropsWithChildren> = ({ children }) => {
  return (
    <header className="my-3 w-full flex justify-center">{children}</header>
  );
};

const Body: FC<PropsWithChildren> = ({ children }) => {
  return <main className="w-full">{children}</main>;
};

const Footer: FC<PropsWithChildren> = ({ children }) => {
  return (
    <footer className=" mt-5 w-full flex justify-center">{children}</footer>
  );
};

export const Modal = Object.assign(Root, { Header, Body, Footer });
