import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    // Windows 上 Node 的原生文件监听很脆：编辑器原子保存留下的
    // `.<name>.<pid>.<id>.tmpdir`、刚下载还在被占用的文件，都会让
    // chokidar 抛 EBUSY，而 Vite 没有兜住这个 error，dev server 直接退出。
    // 所以这里改成轮询监听（不会对文件句柄加 watch），代价是改动后
    // 反射到浏览器约慢 300ms；同时把临时产物排除掉，减少无谓轮询。
    watch: {
      usePolling: true,
      interval: 300,
      ignored: [
        '**/.*.tmpdir',
        '**/*.tmpdir',
        '**/*.tmp',
        '**/*.swp',
        '**/*~',
      ],
    },
  },
});
