import { GitHub } from '@mui/icons-material';
import Link from 'next/link';

export default function TheFooter() {
  return (
    <footer className="w-full p-6 flex items-center justify-center bg-white dark:bg-black/50 backdrop-blur">
      <div className="flex flex-row items-end justify-end gap-4">
        &copy; {new Date().getFullYear()} FELIPE BUENO{' '}
        <Link href="https://github.com/fe-m-bueno/felipe-bueno">
          <GitHub className="w-6 h-6 transition-all ease-in-out duration-200 hover:text-rose-500" />
        </Link>
      </div>
    </footer>
  );
}
