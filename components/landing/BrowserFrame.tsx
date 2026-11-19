import type { ReactNode } from 'react';

const FRAME_SHADOW =
  'inset 0 1px 0 rgb(247 248 252 / .09), 0 70px 160px -40px rgb(3 4 8 / .95), 0 40px 110px -30px rgb(108 99 245 / .32)';

/** App-window chrome (traffic lights) around a product screenshot. */
export function BrowserFrame({ children }: { children: ReactNode }) {
  return (
    <div
      className="overflow-hidden rounded-2xl border border-fg/9 bg-linear-to-b from-[rgb(21_25_40/.92)] to-[rgb(11_14_24/.96)]"
      style={{ boxShadow: FRAME_SHADOW }}
    >
      <div className="flex items-center gap-2 border-b border-fg/6 bg-fg/2 px-[18px] py-[13px]">
        {[0, 1, 2].map((i) => (
          <span key={i} className="size-2.5 rounded-full bg-fg/13" />
        ))}
      </div>
      {children}
    </div>
  );
}
