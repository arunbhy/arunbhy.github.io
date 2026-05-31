# arunbhy.github.io

My personal portfolio. A single-page site that covers my work, projects, writing and
contact details, with a light and dark theme. Built with React and Vite.

Live at https://arunbhy.github.io and https://arunbhy.com.

## Tech stack

- React 19
- Vite 8
- React Router (HashRouter) for the blog routes
- Bootstrap and plain CSS for styling
- React Type Animation for the hero
- Formspree for the contact form

## Running locally

You need Node 18 or higher and npm.

```bash
git clone https://github.com/arunbhy/arunbhy.github.io.git
cd arunbhy.github.io
npm install
npm run dev
```

The dev server runs at http://localhost:5173.

## Build and deploy

The site deploys to GitHub Pages from the `dist` build.

```bash
npm run build   # output goes to dist/
npm run deploy  # publishes dist/ via gh-pages
```

## Where the content lives

- Hero copy: `src/components/Home/Home.jsx`
- About: `src/components/About/About.jsx`
- Projects: `src/assets/files/ProjectDetails.js`
- Work history: `src/assets/files/WorkDetails.js`
- Education: `src/assets/files/EducationDetails.js`
- Skills: `src/assets/files/SkillsDetails.js`
- Achievements: `src/assets/files/AchievementsDetails.js`
- Blog posts: `public/blog/posts.json` and the Markdown in `public/blog/`
- Theme colours: CSS variables in `src/index.css`

## Contact

Arunbh Yashaswi
- Email: arunbh.y@gmail.com
- GitHub: https://github.com/kautilyaa
