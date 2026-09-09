'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Sliders, Save, Check, ExternalLink } from 'lucide-react';
import { useStore } from '@/lib/use-store';

export default function AdminHomepageCMSPage() {
  const { cms, updateHomepageCMS, collections } = useStore();
  const [headline, setHeadline] = useState(cms.heroHeadline);
  const [subheadline, setSubheadline] = useState(cms.heroSubheadline);
  const [primaryCtaText, setPrimaryCtaText] = useState(cms.heroPrimaryCtaText);
  const [primaryCtaLink, setPrimaryCtaLink] = useState(cms.heroPrimaryCtaLink);
  const [secondaryCtaText, setSecondaryCtaText] = useState(cms.heroSecondaryCtaText);
  const [secondaryCtaLink, setSecondaryCtaLink] = useState(cms.heroSecondaryCtaLink);
  const [heroImage, setHeroImage] = useState(cms.heroImageUrl);
  const [announcement, setAnnouncement] = useState(cms.announcementText);
  const [isAnnounceActive, setIsAnnounceActive] = useState(cms.isAnnouncementActive);
  const [featuredColId, setFeaturedColId] = useState(cms.featuredCollectionId);
  const [storyTitle, setStoryTitle] = useState(cms.brandStoryTitle);
  const [story1, setStory1] = useState(cms.brandStoryParagraph1);
  const [story2, setStory2] = useState(cms.brandStoryParagraph2);
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateHomepageCMS({
      heroHeadline: headline,
      heroSubheadline: subheadline,
      heroPrimaryCtaText: primaryCtaText,
      heroPrimaryCtaLink: primaryCtaLink,
      heroSecondaryCtaText: secondaryCtaText,
      heroSecondaryCtaLink: secondaryCtaLink,
      heroImageUrl: heroImage,
      announcementText: announcement,
      isAnnouncementActive: isAnnounceActive,
      featuredCollectionId: featuredColId,
      brandStoryTitle: storyTitle,
      brandStoryParagraph1: story1,
      brandStoryParagraph2: story2,
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-16">
      {/* Toast */}
      {saved && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#111827] text-white px-4 py-2.5 rounded-md shadow-xl text-xs font-bold flex items-center gap-2 border border-[#374151]">
          <Check size={16} className="text-[#10B981]" />
          <span>Homepage CMS changes committed to live storefront!</span>
        </div>
      )}

      {/* Header */}
      <div className="flex justify-between items-center border-b border-[#E5E7EB] pb-6">
        <div>
          <h1 className="text-2xl font-bold text-[#111827]">Homepage CMS & Hero Editor</h1>
          <p className="text-xs text-[#6B7280] mt-0.5">
            Modify storefront hero banners, headlines, announcement ticker, and editorial story without code.
          </p>
        </div>
        <Link
          href="/"
          target="_blank"
          className="flex items-center gap-1 text-xs font-bold text-[#4D5936] hover:underline"
        >
          <span>Preview Live Homepage</span>
          <ExternalLink size={13} />
        </Link>
      </div>

      <form onSubmit={handleSave} className="space-y-8">
        {/* Announcement Bar */}
        <div className="p-6 bg-white border border-[#E5E7EB] rounded-lg shadow-sm space-y-4">
          <div className="flex justify-between items-center border-b border-[#E5E7EB] pb-3">
            <h3 className="text-sm font-bold text-[#111827] uppercase tracking-wider">Top Announcement Ticker</h3>
            <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-[#374151]">
              <input
                type="checkbox"
                checked={isAnnounceActive}
                onChange={(e) => setIsAnnounceActive(e.target.checked)}
                className="accent-[#4D5936]"
              />
              <span>Display Ticker</span>
            </label>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-[#374151]">Ticker Text Content</label>
            <input
              type="text"
              value={announcement}
              onChange={(e) => setAnnouncement(e.target.value)}
              className="w-full border border-[#D1D5DB] rounded p-2 text-xs font-mono uppercase text-[#111827]"
            />
          </div>
        </div>

        {/* Hero Section */}
        <div className="p-6 bg-white border border-[#E5E7EB] rounded-lg shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-[#111827] uppercase tracking-wider border-b border-[#E5E7EB] pb-3">
            Cinematic Hero Banner
          </h3>

          <div className="space-y-4 text-xs">
            <div className="space-y-1">
              <label className="font-bold text-[#374151]">Hero Large Headline</label>
              <input
                type="text"
                required
                value={headline}
                onChange={(e) => setHeadline(e.target.value)}
                className="w-full border border-[#D1D5DB] rounded p-2 text-sm font-bold text-[#111827]"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-[#374151]">Hero Subheadline Statement</label>
              <input
                type="text"
                required
                value={subheadline}
                onChange={(e) => setSubheadline(e.target.value)}
                className="w-full border border-[#D1D5DB] rounded p-2 text-xs text-[#111827]"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="font-bold text-[#374151]">Primary CTA Label</label>
                <input
                  type="text"
                  value={primaryCtaText}
                  onChange={(e) => setPrimaryCtaText(e.target.value)}
                  className="w-full border border-[#D1D5DB] rounded p-2 text-xs uppercase text-[#111827]"
                />
              </div>
              <div className="space-y-1">
                <label className="font-bold text-[#374151]">Primary CTA Destination URL</label>
                <input
                  type="text"
                  value={primaryCtaLink}
                  onChange={(e) => setPrimaryCtaLink(e.target.value)}
                  className="w-full border border-[#D1D5DB] rounded p-2 text-xs font-mono text-[#111827]"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="font-bold text-[#374151]">Hero Background Photography URL</label>
              <input
                type="url"
                value={heroImage}
                onChange={(e) => setHeroImage(e.target.value)}
                className="w-full border border-[#D1D5DB] rounded p-2 text-xs text-[#111827]"
              />
              <div className="relative aspect-[16/6] bg-[#111] rounded overflow-hidden mt-2">
                <Image src={heroImage} alt="Hero preview" fill className="object-cover" sizes="600px" />
              </div>
            </div>
          </div>
        </div>

        {/* Brand Story Editorial */}
        <div className="p-6 bg-white border border-[#E5E7EB] rounded-lg shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-[#111827] uppercase tracking-wider border-b border-[#E5E7EB] pb-3">
            Brand Story Manifesto Section
          </h3>

          <div className="space-y-3 text-xs">
            <div className="space-y-1">
              <label className="font-bold text-[#374151]">Story Headline</label>
              <input
                type="text"
                value={storyTitle}
                onChange={(e) => setStoryTitle(e.target.value)}
                className="w-full border border-[#D1D5DB] rounded p-2 text-xs font-bold text-[#111827]"
              />
            </div>
            <div className="space-y-1">
              <label className="font-bold text-[#374151]">Paragraph 1</label>
              <textarea
                rows={3}
                value={story1}
                onChange={(e) => setStory1(e.target.value)}
                className="w-full border border-[#D1D5DB] rounded p-2 text-xs text-[#111827]"
              />
            </div>
            <div className="space-y-1">
              <label className="font-bold text-[#374151]">Paragraph 2</label>
              <textarea
                rows={3}
                value={story2}
                onChange={(e) => setStory2(e.target.value)}
                className="w-full border border-[#D1D5DB] rounded p-2 text-xs text-[#111827]"
              />
            </div>
          </div>
        </div>

        <button
          type="submit"
          className="px-8 py-3.5 bg-[#4D5936] hover:bg-[#343D2D] text-white rounded-md text-xs font-bold uppercase tracking-widest transition-colors flex items-center gap-2"
        >
          <Save size={16} />
          <span>Save & Apply CMS Updates</span>
        </button>
      </form>
    </div>
  );
}

