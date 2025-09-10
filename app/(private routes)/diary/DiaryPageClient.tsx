'use client';
import DiaryList from '@/components/DiaryList/DiaryList';
import { useMediaQuery } from 'react-responsive';

const DiaryPageClient = () => {
  const isDesktop = useMediaQuery({ minWidth: 1440 });
  return isDesktop ? (
    <>
      <DiaryList />
      <p>
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Veniam ratione iste accusantium
        voluptatibus, at, harum impedit ducimus quibusdam modi amet quidem magni, asperiores nostrum
        aspernatur blanditiis quas dolor aut reiciendis neque magnam rerum ipsum deserunt. Est sit
        dolorem magnam, veniam iste repudiandae libero excepturi repellendus laudantium aliquam
        necessitatibus quisquam, iusto at dolor nulla beatae corporis fugit mollitia nisi?
        Architecto eligendi distinctio odit cupiditate! Temporibus omnis impedit obcaecati quaerat
        nam, odit, dicta tempora perspiciatis vitae odio ab at nemo, a distinctio fuga
        necessitatibus sunt porro aut sapiente provident sit vero explicabo! Expedita ab tempore
        dolorum asperiores rem accusantium soluta dolor voluptates.
      </p>
    </>
  ) : (
    <DiaryList />
  );
};

export default DiaryPageClient;
