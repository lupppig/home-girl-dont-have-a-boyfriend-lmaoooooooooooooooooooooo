"use client";

import Image, { type StaticImageData } from "next/image";
import { useState } from "react";
import { APPLICATIONS } from "@/game/data";
import { useGame } from "@/game/state";
import { Dialog, Screen } from "@/components/game/Screen";
import applicantKevin from "../../../../image/3f68bb116a186c7bcb85f5bde30835d9.jpg";
import applicantDaniel from "../../../../image/45153782d81832a26b0c497553d967e3.jpg";
import applicantTyrese from "../../../../image/964a5196f4b7411166fcaa5593332eac.jpg";
import applicantMarcus from "../../../../image/e0421ebb0fc9c8b12262b3b86e89204d.jpg";
import applicant2019 from "../../../../image/edb8bc10a8b5889cc58ba700652deb68.jpg";
import applicantReserve from "../../../../image/cd1771807ac728be4e0f6842103dbda1.jpg";

const APPLICANT_PHOTOS: StaticImageData[] = [
  applicantKevin,
  applicantDaniel,
  applicantTyrese,
  applicantMarcus,
  applicant2019,
  applicantReserve,
];

function Row({ k, v, tone }: { k: string; v: string; tone?: "good" | "bad" }) {
  return (
    <div className="flex items-baseline gap-3 border-b border-plum/12 py-2 last:border-0">
      <span className="sys w-[7.5rem] shrink-0 text-[0.58rem] text-burgundy sm:w-[10rem] sm:text-[0.62rem]">{k}</span>
      <span
        className={`text-[0.92rem] leading-snug ${
          tone === "good" ? "text-[#0f7a45]" : tone === "bad" ? "text-alarm" : "text-plum"
        }`}
      >
        {v}
      </span>
    </div>
  );
}

export default function Applications() {
  const { go, decide } = useGame();
  const [i, setI] = useState(0);
  const [reply, setReply] = useState<string | null>(null);

  const app = APPLICATIONS[i];
  const last = i === APPLICATIONS.length - 1;

  const act = (kind: "accept" | "reject" | "block") => {
    decide(kind, app.green);
    setReply(kind === "accept" ? app.onAccept : kind === "reject" ? app.onReject : app.onBlock);
  };

  const next = () => {
    setReply(null);
    if (last) go("intervention");
    else setI((n) => n + 1);
  };

  return (
    <Screen>
      <Dialog title={`LEVEL 4 — THE APPLICATIONS · ${i + 1}/${APPLICATIONS.length}`}>
        <p className="display text-[8vw] leading-[0.9] text-plum sm:text-[2.6rem]">Men are applying.</p>
        <p className="mt-2 max-w-[62ch] text-[0.95rem] leading-relaxed text-burgundy">
          Word got out about you, Pikachu. Review each one. Be honest — we can see your face. 👀
        </p>

        {!reply ? (
          <>
            <div key={app.id} className="pop mt-4 overflow-hidden rounded-xl border-2 border-plum bg-ivory">
              <div className="grid sm:grid-cols-[10rem_1fr]">
                <div className="relative h-[min(52dvh,22rem)] overflow-hidden border-b-2 border-plum bg-plum/8 sm:h-auto sm:min-h-0 sm:border-r-2 sm:border-b-0">
                  <Image
                    src={APPLICANT_PHOTOS[i]}
                    alt={`Applicant portrait for ${app.name}`}
                    fill
                    priority={i === 0}
                    sizes="(max-width: 640px) 100vw, 160px"
                    className="object-contain object-center sm:object-cover sm:object-top sm:grayscale-[12%]"
                  />
                  <span className="sys absolute bottom-2 left-2 rounded-sm bg-plum/90 px-2 py-1 text-[0.48rem] text-ivory">
                    FACE MATCH · {91 - i * 3}%
                  </span>
                </div>
                <div className="px-4 py-3 sm:px-5">
                  <div className="mb-2 flex items-center justify-between">
                    <span className="sys text-[0.58rem] text-hotpink">APPLICATION #{app.id}</span>
                    <span className="sys text-[0.54rem] text-burgundy">unverified</span>
                  </div>
                  <Row k="Name" v={app.name} />
                  <Row k="Occupation" v={app.occupation} tone={app.green ? "good" : "bad"} />
                  <Row k="Communication" v={`${app.comms}/100`} tone={app.comms > 60 ? "good" : "bad"} />
                  <Row k="Emotional intelligence" v={app.eq} tone={app.green ? "good" : "bad"} />
                  <Row k="Intentions" v={app.intentions} />
                  <Row
                    k="Mother approval"
                    v={`${app.motherApproval}%`}
                    tone={app.motherApproval > 50 ? "good" : "bad"}
                  />
                </div>
              </div>
              <div className="flex items-center gap-1 border-t-2 border-plum bg-cream px-2 py-1.5 sm:gap-1.5 sm:px-3 sm:py-2" aria-label="Applicant queue">
                {APPLICANT_PHOTOS.map((photo, photoIndex) => (
                  <span
                    key={photo.src}
                    className={`relative h-7 w-7 shrink-0 overflow-hidden rounded-md border-2 sm:h-8 sm:w-8 ${photoIndex === i ? "border-hotpink" : "border-plum/30 opacity-55"}`}
                  >
                    <Image src={photo} alt="" fill sizes="32px" className="object-contain object-center sm:object-cover sm:object-top" />
                  </span>
                ))}
                <span className="micro ml-1 hidden text-[0.48rem] text-burgundy min-[390px]:inline">5 reviews · 1 on reserve</span>
              </div>
            </div>

            <div className="mt-3 grid grid-cols-2 gap-2 sm:mt-4 sm:grid-cols-3 sm:gap-2.5">
              <button className="btn btn-lime !text-[0.6rem]" onClick={() => act("accept")}>
                ACCEPT
              </button>
              <button className="btn btn-cream !text-[0.6rem]" onClick={() => act("reject")}>
                REJECT
              </button>
              <button className="btn btn-danger col-span-2 !text-[0.6rem] sm:col-span-1" onClick={() => act("block")}>
                BLOCK IMMEDIATELY
              </button>
            </div>
          </>
        ) : (
          <div className="rise mt-4">
            <div className="crt p-4 sm:p-5">
              <p className="sys text-[0.55rem] text-babypink/70">COMMITTEE NOTE</p>
              <p className="mt-2 text-[1.02rem] leading-snug text-ivory sm:text-[1.15rem]">{reply}</p>
            </div>
            <div className="mt-4 flex justify-end">
              <button className="btn btn-pink" onClick={next}>
                {last ? "NEXT LEVEL →" : "NEXT APPLICATION →"}
              </button>
            </div>
          </div>
        )}
      </Dialog>
    </Screen>
  );
}
