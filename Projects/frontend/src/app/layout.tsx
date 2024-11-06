import "./globals.css";
import type { Metadata } from "next";
import { appName } from "@/utils/utils";
import { Golos_Text } from 'next/font/google';
import "react-toastify/dist/ReactToastify.css";
import Script from 'next/script';
import Head from "next/head";

const golos = Golos_Text({
  weight: ["400", "500", "600", "700"],
  subsets: ['latin'],
});

const clarityProjectId = process.env.NEXT_PUBLIC_CLARITY_PROJECT_ID;

export const metadata: Metadata = {
  title: appName,
  description: "AI powered exam sheet evaluation",
  keywords: [
    "AI", "exam", "evaluation", "ai exam", "ai evaluation", "quiz", "grading",
    "Exam evaluation software", "Automated grading system", "AI-powered assessment tool",
    "Online exam grading", "Digital answer sheet evaluator", "Smart grading solution",
    "Educational technology platform", "Efficient exam assessment", "Automated scoring software",
    "AI-driven evaluation tool", "Online exam marking", "Digital assessment platform",
    "Smart exam grading", "AI-based scoring system", "Automated evaluation solution"
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-theme="light" className="scroll-smooth">
      <Head>
        <title>{appName}</title>
        <meta name="description" content="AI powered exam sheet evaluation" />
        <link rel="icon" href="/icon.png" />
      </Head>
      <body className={golos.className}>
        {children}
        <Script id="clarity-script" strategy="afterInteractive">
          {`
            (function(c,l,a,r,i,t,y){
                c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
                t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
                y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
            })(window, document, "clarity", "script", "${clarityProjectId}");
          `}
        </Script>
      </body>
    </html>
  );
}
