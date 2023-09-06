// src/components/portfolio.tsx
import 'server-only';

import Image from 'next/image';
import { Container } from './container';
import CtrlFPlusThumbnail from '@/../public/img/thumbnails/ctrl-f-plus-thumbnail.png';
import DenizenDesignerThumbnail from '@/../public/img/thumbnails/denizen-designer-thumbnail.png';
import BorderlineBasicThumbnail from '@/../public/img/thumbnails/borderlinebasicb-thumbnail.png';
import EstTaxMailerThumbnail from '@/../public/img/thumbnails/estimated-tax-mailer-thumbnail.png';
import ChipInThumbnail from '@/../public/img/thumbnails/chip-in-thumbnail.png';
import AminchavezThumbnail from '@/../public/img/thumbnails/Aminchavez.com-thumbnail.png';
import { GithubIcon, WebsiteIcon, DownloadIcon } from './icons';

const projects = [
  {
    title: 'Ctrl-F Plus',
    description:
      'A Browser extension that enables cross-tab search functionality within browser window.',
    image: CtrlFPlusThumbnail,
    altText:
      'Screenshot of the Ctrl-F Plus Chrome Extension, a project by Full Stack Developer Benjamin Chavez',
    preview: true,
    links: [
      {
        type: 'website',
        url: 'https://ctrl-f.plus/',
        icon: <WebsiteIcon />,
      },
      {
        type: 'github',
        url: 'https://github.com/ctrl-f-plus/ctrl-f-plus-chrome-extension',
        icon: <GithubIcon />,
      },
    ],
  },
  {
    title: 'The Denizen Designer Project',
    description:
      'Report for the Equity Health &amp; Innovations Research Lab at DePaul University.',
    image: DenizenDesignerThumbnail,
    altText:
      'Preview of The Denizen Designer Project, a web development work by Benjamin Chavez',
    preview: true,
    links: [
      {
        type: 'website',
        url: 'https://thedenizendesignerproject.dev/',
        icon: <WebsiteIcon />,
      },
      {
        type: 'github',
        url: 'https://github.com/benjamin-chavez/EHI-Lab-DeniGithubIconn-Designer-Website',
        icon: <GithubIcon />,
      },
    ],
  },
  {
    title: 'Borderline Basic',
    description: 'A custom blogging application for writer Brianna Webb.',
    image: BorderlineBasicThumbnail,
    altText:
      'Borderline Basic blog application, a development project by Full Stack Developer Benjamin Chavez',
    preview: true,
    links: [
      {
        type: 'website',
        url: 'https://borderlinebasicb.me/',
        icon: <WebsiteIcon />,
      },
      {
        type: 'github',
        url: 'https://github.com/benjamin-chavez/borderline-basic-b-blog',
        icon: <GithubIcon />,
      },
    ],
  },
  {
    title: 'Estimated Tax Payment Mailer',
    description:
      'Financial planning application that enables financial advisors to automate quarterly tax payments for their clients.',
    image: EstTaxMailerThumbnail,
    altText:
      'Snapshot of Estimated Tax Payment Mailer, a finance application developed by Benjamin Chavez',
    preview: true,
    links: [
      {
        type: 'download',
        url: './Downloadable/Estimated Tax Payment Mailer.zip',
        icon: <DownloadIcon />,
      },
      {
        type: 'github',
        url: 'https://github.com/benjamin-chavez/estimated-taGithubIconpayment-mailer',
        icon: <GithubIcon />,
      },
    ],
  },
  {
    title: 'Chip-In',
    description:
      'A platform to connect individuals and charities with the goal of simplifying the search for community service opportunities.',
    image: ChipInThumbnail,
    altText:
      "Preview of Chip-In, a community service platform built by a team of developers including Benjamin Chavez at Le Wagon's full stack coding bootcamp.",
    preview: true,
    links: [
      {
        type: 'website',
        url: 'https://www.chip-in.site/',
        icon: <WebsiteIcon />,
      },
      {
        type: 'github',
        url: 'https://github.com/benjamin-chavez/Chip-In',
        icon: <GithubIcon />,
      },
    ],
  },
  {
    title: 'Amin Chavez - DJ & Producer',
    description:
      ' Promotional Artist website for my electronic music alias: Amin Chavez.',
    image: AminchavezThumbnail,
    altText:
      "Preview of Amin Chavez website, showcasing Benjamin Chavez's work as a DJ and music producer",
    preview: true,
    links: [
      {
        type: 'website',
        url: 'https://aminchavez.com/',
        icon: <WebsiteIcon />,
      },
      {
        type: 'github',
        url: 'https://github.com/benjamin-chavez/aminchavez-artist-website',
        icon: <GithubIcon />,
      },
    ],
  },
  {
    title: 'intiMASKy',
    description:
      'An online rental marketplace for individuals to find and post fetish Masks.',
    image: '/img/thumbnails/',
    altText: 'intiMasky Website Preview',
    preview: false,
    links: [
      {
        type: 'website',
        url: 'https://intimasky.lol/',
        icon: <WebsiteIcon />,
      },
      {
        type: 'github',
        url: 'https://github.com/benjamin-chavez/',
        icon: <GithubIcon />,
      },
    ],
  },
];

function PortfolioCard({ project }: { project: any }) {
  return (
    <>
      <div
        // box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
        className="shadow-basic relative aspect-video w-full"
      >
        <Image
          src={project.image}
          className="absolute inset-0 "
          fill
          alt={''}
        />
        <div className="relative z-10 flex h-full flex-col justify-center bg-black/70 p-4 text-center text-white">
          <h3
            // font-medium
            className="font-dosis text-3xl  tracking-[.18rem]"
          >
            {project.title}
          </h3>
          <p className="font-open-sans xs:block hidden text-base text-gray-400">
            {project.description}
          </p>
          <div className="flex justify-center gap-2">
            {project.links.map((link: any) => (
              <a
                key="url"
                // px-2 py-1
                className="font-open-sans flex w-14 items-center justify-center rounded border border-white py-2 text-base text-gray-400 hover:text-white"
                href={link.url}
                target="_blank"
              >
                {link.icon && link.icon}
              </a>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

export default function Portfolio() {
  return (
    <Container
      as="section"
      // max-w-screen-2xl
      className="mt-12  pt-4"
      id="portfolio"
    >
      {/* // <section className="mt-12 pt-4" id="portfolio"> */}
      <div className="flex flex-col items-center justify-center ">
        <h2 className="font-dosis text-3xl uppercase leading-9 tracking-[.4rem] text-[#141414]">
          Portfolio
        </h2>

        <h3 className="pt-2 text-gray-500">
          A selection of my work as a full stack Developer in The U.S. and
          Germany.
        </h3>
      </div>
      <div className="grid grid-cols-1 gap-x-6 gap-y-7 pt-6 lg:grid-cols-2 xl:grid-cols-3">
        {projects.map(
          (project) =>
            project.preview && (
              <>
                <PortfolioCard key={project.title} project={project} />
              </>
            ),
        )}
      </div>
    </Container>
  );
}
