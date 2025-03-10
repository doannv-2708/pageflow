import React, {useContext, useState, createContext, useMemo, useRef} from 'react';
import classNames from 'classnames';
import {Range} from 'slate';

import {useI18n} from '../../i18n';
import {useChapter} from '../../../entryState';
import {SectionThumbnail} from '../../SectionThumbnail';

import styles from './index.module.css';

import ExternalLinkIcon from '../images/externalLink.svg';

const UpdateContext = createContext();

export function LinkTooltipProvider({editor, disabled, children}) {
  const [state, setState] = useState();
  const outerRef = useRef();

  const update = useMemo(() => {
    let timeout;

    return {
      activate(href, openInNewTab, linkRef) {
        clearTimeout(timeout);
        timeout = null;

        const outerRect = outerRef.current.getBoundingClientRect();
        const linkRect = linkRef.current.getBoundingClientRect();

        setState({
          href,
          openInNewTab,
          top: linkRect.bottom - outerRect.top + 10,
          left: linkRect.left - outerRect.left
        });
      },

      keep() {
        clearTimeout(timeout);
        timeout = null;
      },

      deactivate() {
        if (!timeout) {
          timeout = setTimeout(() => {
            timeout = null;
            setState(null)
          }, 200);
        }
      }
    }
  }, []);

  return (
    <UpdateContext.Provider value={update}>
      <div ref={outerRef}>
        <LinkTooltip editor={editor} state={state} disabled={disabled} />
        {children}
      </div>
    </UpdateContext.Provider>
  );
}

export function LinkPreview({href, openInNewTab, children}) {
  const {activate, deactivate} = useContext(UpdateContext);
  const ref = useRef();
  return (
    <span ref={ref}
          onMouseEnter={() => activate(href, openInNewTab, ref)}
          onMouseLeave={deactivate}
          onMouseDown={deactivate}>
      {children}
    </span>
  );
}

export function LinkTooltip({editor, disabled, state}) {
  const {keep, deactivate} = useContext(UpdateContext);

  if (disabled || !state || (editor.selection && !Range.isCollapsed(editor.selection))) {
    return null;
  }

  return (
    <div className={classNames(styles.linkTooltip, styles.hoveringToolbar)}
         onMouseEnter={keep}
         onMouseLeave={deactivate}
         style={{top: state.top, left: state.left, opacity: 1}}>
      <LinkDestination href={state.href} openInNewTab={state.openInNewTab} />
    </div>
  );
}

function LinkDestination({href, openInNewTab}) {
  if (href?.chapter) {
    return (
      <ChapterLinkDestination permaId={href.chapter} />
    )
  }
  else if (href?.section) {
    return (
      <SectionLinkDestination permaId={href.section} />
    )
  }
  else {
    return (
      <ExternalLinkDestination href={href} openInNewTab={openInNewTab} />
    );
  }
}

function ChapterLinkDestination({permaId}) {
  const chapter = useChapter({permaId});
  const {t} = useI18n({locale: 'ui'});

  if (!chapter) {
    return '(Deleted chapter)';
  }

  return (
    <a href={`#${chapter.chapterSlug}`}
       title={t('pageflow_scrolled.inline_editing.link_tooltip.visit_chapter')}>
      <span className={styles.linkTooltipChapterNumber}>
        {t('pageflow_scrolled.inline_editing.link_tooltip.chapter_number',
           {number: chapter.index + 1})}
      </span> {chapter.title}
    </a>
  );
}

function SectionLinkDestination({permaId}) {
  const {t} = useI18n({locale: 'ui'});

  return (
    <div className={styles.linkTooltipThumbnail}>
      <SectionThumbnail sectionPermaId={permaId} />
      <a href={`#section-${permaId}`}
         className={styles.linkTooltipThumbnailClickMask}
         title={t('pageflow_scrolled.inline_editing.link_tooltip.visit_section')}>
      </a>
    </div>
  );
}

function ExternalLinkDestination({href, openInNewTab}) {
  const {t} = useI18n({locale: 'ui'});

  return (
    <>
      <a href={href}
         target="_blank"
         rel="noopener noreferrer">
        {href}
        <ExternalLinkIcon width={10} height={10} />
      </a>
      <div className={styles.linkTooltipNewTab}>
        {openInNewTab ?
         t('pageflow_scrolled.inline_editing.link_tooltip.opens_in_new_tab') :
         t('pageflow_scrolled.inline_editing.link_tooltip.opens_in_same_tab')}
      </div>
    </>
  );
}
