# StudentHub - Student Portal (ITUE203 WDF)

**Author:** Shagun Desai (CE2) | **Enrollment:** D26DCE161

StudentHub is a semester-long web-development project: a responsive, accessible student portal built with
HTML5, CSS3 and vanilla JavaScript (ES6+).

## Problem scope
Students, faculty and admins currently use scattered notice boards and messaging groups. StudentHub provides one
place for registration, events, notices, dashboard, feedback and administration.

## User roles
| Role | Main abilities |
|------|----------------|
| Visitor | View Home, About, Events, FAQ, Contact; register / login |
| Student | Dashboard, profile, event registration, feedback |
| Faculty | Post notices, manage events (planned) |
| Admin | Manage users, events, reports |

## Pages (11)
Home, About, Register, Login, Dashboard, Events, Profile, Contact, Admin, FAQ, Feedback

## Folder structure
```
studenthub/
|-- index.html  about.html  register.html  login.html  dashboard.html
|-- events.html profile.html contact.html  admin.html  faq.html  feedback.html
|-- css/
|   |-- common.css      (shared: variables, header, nav, buttons, cards, forms, footer)
|   |-- index.css  about.css  register.css  login.css  dashboard.css
|   `-- events.css profile.css contact.css  admin.css  faq.css  feedback.css
|-- js/main.js        (Practical 4 - DOM & interactivity)
|-- js/validate.js    (Practical 5 - form validation)
|-- images/avatar.svg
|-- docs/             (sitemap, wireframes, ER diagram)
`-- README.md
```

## Practical roadmap
| Practical | Topic |
|-----------|-------|
| 1 | Requirement analysis, sitemap, wireframe, GitHub setup |
| 2 | Semantic HTML5 pages + accessibility |
| 3 | Responsive UI (Grid, Flexbox, media queries) |
| 4 | JavaScript DOM, events, localStorage theme |
| 5 | Registration form validation with RegEx |

## CSS architecture
Each page links **two** stylesheets: `css/common.css` (shared rules) and its own `css/<page>.css`
(e.g. `index.html` -> `index.css`, `admin.html` -> `admin.css`).

## How to run
Open `index.html` in any modern browser (no build step needed).

## Git workflow
```
git init
git add .
git commit -m "Practical 1: project setup, sitemap, wireframe"
git branch -M main
git remote add origin https://github.com/<your-username>/studenthub.git
git push -u origin main
```
Commit after every practical, e.g. `Practical 2: semantic HTML pages`.
