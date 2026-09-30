import { homeConfig } from '@/config/home.config';
import { ContactTrigger } from '@/components/contact/ContactTrigger';
import { Container } from '@/components/layout/Container';
import { MediaFrame } from '@/components/ui/MediaFrame';
import { ResponsiveArt } from '@/components/ui/ResponsiveArt';
import { Eyebrow, HeadlineLines, Index } from '@/components/ui/Typography';
import { Reveal } from '@/motion/Reveal';

/**
 * Copy on the left, a reserved delivery composition on the right.
 * The current image is interim; the frame ratio is the art brief.
 */
export function Operators() {
  const { operators } = homeConfig;
  return (
    <section aria-labelledby="operators-title" className="w-full bg-(--tone-operators)">
      <Container size="wide">
        <div className="grid-fnx items-center gap-y-8">
          <div className="md:col-span-6">
            <Eyebrow rule>{operators.eyebrow}</Eyebrow>
            <h2 id="operators-title" className="mt-4 text-display text-white">
              <HeadlineLines lines={operators.headline} />
            </h2>
            <p className="prose-measure mt-5 text-lead text-text-secondary">{operators.body}</p>
            <ContactTrigger appearance="link" placement="home-operators" interest={operators.cta.interest} className="mt-6">
              {operators.cta.label}
            </ContactTrigger>
          </div>
          <MediaFrame slot="device" className="md:col-span-5 md:col-start-8">
            <ResponsiveArt
              src={operators.art.src}
              alt=""
              sizes="(max-width: 899px) 100vw, 36vw"
              quality={80}
              objectPosition="72% 50%"
            />
          </MediaFrame>
        </div>

        <div className="mt-header grid-fnx">
        <Reveal as="ul" className="grid gap-x-(--grid-gap) sm:grid-cols-3 md:col-span-6">
          {operators.capabilities.map((item, index) => (
            <li key={item.label} className="border-t border-white/[0.09] py-4">
              <div className="flex items-baseline gap-3">
                <Index n={index + 1} className="text-violet-300/80" />
                <h3 className="text-eyebrow text-white uppercase">{item.label}</h3>
              </div>
              <p className="mt-2 text-body text-text-secondary">{item.body}</p>
            </li>
          ))}
        </Reveal>
        </div>
      </Container>
    </section>
  );
}
