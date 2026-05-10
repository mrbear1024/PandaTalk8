import { getSiteSettings } from "@/lib/site-settings";

export default async function WechatPromo({ compact = false }: { compact?: boolean }) {
  const { site } = await getSiteSettings();
  return (
    <div id="wechat" className={`wechat-promo${compact ? " compact" : ""}`}>
      <div className="wechat-promo-copy">
        <div className="eyebrow">WeChat</div>
        <h2>订阅公众号 {site.wechatName}</h2>
        <p>
          扫码关注，或微信搜一搜 <strong>{site.wechatName}</strong>。社群加入方式、AI 学习资料、
          X 增长复盘都会优先在公众号里更新。
        </p>
      </div>
      <div className="wechat-promo-visual">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img className="wechat-qr" src={site.wechatQr} alt={`公众号 ${site.wechatName} 二维码`} />
        {!compact ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img className="wechat-material" src={site.wechatMaterial} alt={`微信搜一搜 ${site.wechatName}`} />
        ) : null}
      </div>
    </div>
  );
}
