import React from "react";
import { Link } from "react-router-dom";
import { connect } from 'react-redux';

function mapStateToProps(state) {
  return {
    agenda: state.agenda,
    meetingDay: state.client.meetingDay
  }
};

// Layout footer consisting of a previous link, any number of buttons,
// followed by a next link.
//
// Overrides previous and next links when traversal is queue, shepherd, or
// Flagged.  Injects the flagged items into the flow on the meeting day
// (last executive officer <-> first flagged/unapproved/missing &&
//  last flagged/unapproved/missing <-> first Special order)
//
function Footer(props) {
  let item = props.item || props;
  let { traversal, meetingDay } = props;

  let color = props.color || item?.status?.color || 'blank'

  return <footer className={`fixed-bottom navbar ${color}`}>
    <PrevLink item={item} agenda={props.agenda} traversal={traversal} meetingDay={meetingDay} />

    <span>{props.buttons ? props.buttons.map(button => {
      if (button.text) {
        let bprops = { ...button.attrs, key: button.text };

        if (button.attrs.class) {
          bprops.className = button.attrs.class.split(" ");
          delete bprops.class;
        };

        return React.createElement("button", bprops, button.text)
      } else if (button.type) {
        let type = button.type;
        if (type.WrappedComponent) type = type.WrappedComponent;
        return React.createElement(button.type, { ...button.attrs, key: type.name })
      }

      return null
    }) : null}</span>

    <NextLink item={item} agenda={props.agenda} traversal={traversal} meetingDay={meetingDay} />
  </footer>
};

/* eslint-disable jsx-a11y/anchor-is-valid, jsx-a11y/anchor-has-content */

function PrevLink(props) {
  let { agenda, item, traversal, meetingDay } = props;

  let link = item?.prev;
  if (link && !link.title) link = agenda[link];
  let prefix = "/";

  if (traversal === "queue") {
    while (link && !link.status.ready_for_review) {
      link = agenda[link.prev]
    };

    if (link) {
      prefix = "/queue/";
    } else {
      link = link || { href: "queue", title: "Queue" };
    }
  } else if (traversal === "shepherd") {
    while (link && link.shepherd !== item.shepherd) {
      link = agenda[link.prev]
    };

    if (link) {
      prefix = "/shepherd/queue/";
    } else {
      link = {
        href: `shepherd/${item.shepherd}`,
        title: "Shepherd"
      }
    }
  } else if (traversal === "flagged") {
    prefix = "/flagged/";

    while (link && link.status.skippable) {
      if (/^\d+[A-Z]*$/m.test(link.attach)) {
        prefix = "/";
        break
      } else {
        link = agenda[link.prev]
      }
    };

    if (!link) {
      prefix = "/";
      link = link || { href: "flagged", title: "Flagged" }
    }
  } else if (meetingDay && link && /^\d/m.test(item.attach) && /^[A-Z]/m.test(link.attach)) {
    while (link && link.status.skippable && /^([A-Z]|\d+$)/m.test(link.attach)) {
      link = agenda[link.prev]
    };

    prefix = "/flagged/"
  };

  if (link) {
    if (!/^([A-Z]|\d+$)/m.test(link.attach)) prefix = "/";

    let color = link?.status?.color || 'blank';

    return prefix === '/' && link.href.startsWith('../')
      ? <a aria-label='prev' className={`navbar-brand backlink ${color}`} rel="prev" href={link.href}>{link.title}</a>
      : <Link aria-label='prev' className={`navbar-brand backlink ${color}`} rel="prev" to={`${prefix}${link.href}`}>{link.title}</Link>
  } else if (item?.prev || item?.next) {
    return <a className="navbar-brand" />
  } else {
    return null
  }
}

function NextLink(props) {
  let { agenda, item, traversal, meetingDay } = props;

  let link = item?.next;
  if (link && !link.title) link = agenda[link];
  let prefix = '/';

  if (traversal === "queue") {
    while (link && !link.status.ready_for_review) {
      link = agenda[link.next]
    };

    if (link) {
      prefix = '/queue/';
    } else {
      link = { href: "queue", title: "Queue" };
    }
  } else if (traversal === "shepherd") {
    while (link && link.shepherd !== item.shepherd) {
      link = agenda[link.next]
    };

    if (link) {
      prefix = "/shepherd/queue/";
    } else {
      link = {
        href: `shepherd/${item.shepherd}`,
        title: "Shepherd"
      }
    }
  } else if (traversal === "flagged") {
    prefix = "/flagged/";

    while (link && link.status.skippable) {
      if (meetingDay && !/^(\d+|[A-Z]+)$/m.test(link.attach)) {
        prefix = "/";
        break
      } else {
        link = agenda[link.next]
      }
    };

    link = link || { href: "flagged", title: "Flagged" }
  } else if (meetingDay && link && /^\d/m.test(item.attach) && /^[A-Z]/m.test(link.attach)) {
    while (link && link.status.skippable && /^([A-Z]|\d+$)/m.test(link.attach)) {
      link = agenda[link.next]
    };

    prefix = "/flagged/"
  };

  if (link) {
    if (!/^([A-Z]|\d+$)/m.test(link.attach)) prefix = "/";

    let color = link?.status?.color || 'blank';

    return prefix === '/' && link.href.startsWith('../')
      ? <a aria-label='next' className={`navbar-brand nextlink ${color}`} rel="next" href={link.href}>{link.title}</a>
      : <Link aria-label='next' className={`navbar-brand nextlink ${color}`} rel="next" to={`${prefix}${link.href}`}>{link.title}</Link>
  } else if (item?.prev || item?.next) {
    return <a className="navbar-brand" />
  } else {
    return null
  }
}

export default connect(mapStateToProps)(Footer)
