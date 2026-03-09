# **App Name**: DevSensei

## Core Features:

- Landing Page UI Display: Render the application's landing page, including a top navigation bar (logo, 'Login with GitHub' button), a hero section with headline and call-to-action buttons, three feature cards, and a minimal footer.
- Dashboard UI Display: Render the user dashboard, featuring a top bar with logo, user avatar, and logout button, and a main content area with a search bar and a grid of mock repository cards, each with detailed information and an 'Open in DevSensei' button.
- Mock GitHub Authentication: Simulate user login via GitHub to access application features, maintaining a mock authentication state.
- Mock Repository Listing: Display a grid of mock repository cards with relevant details (name, description, primary language, last updated), and allow filtering via a search bar.
- Interactive File Tree Viewer: Provide a collapsible sidebar file tree showing a mock folder and file structure for a selected repository, allowing users to select files.
- Code Content Display: Render mock file content in a code editor-style panel with syntax highlighting, line numbers, and visual highlighting of selected code sections. Above the code panel, include four distinct action buttons: Explain Selected, Debug, Improve, Generate Feature.
- AI Code Explanation Tool (Mocked): Present a chat-style interface that provides mock structured explanations with a mentor-like, calm, senior developer tone, using headings: 'What this code does', 'Why it is structured this way', 'Possible improvements', when users select code and request explanations. The AI chat panel must include a toggle switch for Beginner Mode and Advanced Mode.
- Page Navigation & State Management: Manage mock state for seamless navigation between the Landing Page, Dashboard, and Repository View, maintaining a component-based structure.
- Responsive Layout Adaptation: Ensure all application pages and components adapt fluidly across various screen sizes, from mobile to desktop.

## Style Guidelines:

- Primary color: Muted indigo-blue (#4B5D91), providing a professional and intelligent core. This tone is neither bold nor vibrant, suitable for a sophisticated interface and for balancing against a very light background.
- Background color: Extremely light, desaturated blue-gray (#ECEFF8), serving as a clean and unobtrusive base that subtly integrates with the primary color scheme.
- Accent color: Soft, vibrant sky blue (#52A2DD) for interactive elements, calls-to-action, and highlights, offering clear contrast while maintaining the overall soft aesthetic.
- Primary typeface for headlines and body text: 'Inter' (sans-serif), chosen for its modern, neutral, and highly readable characteristics, fitting a professional developer tool.
- Monospace typeface for code display: 'Source Code Pro' (monospace sans-serif), specifically for code editor-style panels, ensuring legibility and alignment for technical content.
- Use a consistent set of minimal, outline-style icons. Icons should be clear and functional, supporting the clean and uncluttered aesthetic without distraction.
- Adopt a modern, spacious layout with ample clean spacing around UI elements. Emphasize a clear information hierarchy using visual separation rather than heavy borders. Utilize a 3-column main interface for the repository view (sidebar, code, AI chat).
- Elements will feature subtle shadow depth and consistent rounded corners (8-12px), adding a touch of modern softness and visual sophistication without clutter.
- Incorporate smooth and subtle transitions for page navigation, element interactions (e.g., hover states on cards, expanding/collapsing file tree), enhancing the user experience without being intrusive.