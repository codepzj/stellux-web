'use client'

import Image from 'next/image'

export default function Footer() {
  return (
    <footer className="max-w-3xl mx-auto w-full bg-transparent">
      <div className="px-4 py-6 flex flex-col items-center gap-2">
        <p className="text-gray-500 dark:text-gray-400 text-sm text-center">
          © {new Date().getFullYear()} powered by{' '}
          <a
            href="https://cnb.cool/codepzj/stellux-server"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-gray-700 dark:hover:text-gray-200 transition-colors duration-200"
          >
            stellux
          </a>
        </p>
        <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
          <div className="flex items-center gap-1">
            <Image src="/icp.png" alt="备案图标" width={14} height={14} />
            <a
              href="https://beian.miit.gov.cn/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-gray-700 dark:hover:text-gray-200 transition-colors duration-200"
            >
              粤ICP备2024275864号-4
            </a>
          </div>
          <div className="flex items-center gap-2">
            <a
              href="/rss.xml"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-gray-700 dark:hover:text-gray-200 transition-colors duration-200"
              title="RSS订阅"
            >
              RSS
            </a>
            <span className="text-gray-300">|</span>
            <a
              href="/atom.xml"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-gray-700 dark:hover:text-gray-200 transition-colors duration-200"
              title="Atom订阅"
            >
              Atom
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
