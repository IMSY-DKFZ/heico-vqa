# HeiCo-VQA-Base Website

This is the official website for **HeiCo-VQA-Base: Evaluating Vision Language Models in Surgical Domains**, built using the [Nerfies](https://github.com/nerfies/nerfies.github.io) template.

## Overview

HeiCo-VQA-Base represents the first large-scale comprehensive evaluation of Vision Language Models (VLMs) specifically in surgical contexts. This website showcases:

- **24,252 surgical images** and **167,384 Q&A pairs** from laparoscopic procedures
- Evaluation of **31+ state-of-the-art VLMs**
- **8 distinct task categories** including spatial understanding, depth perception, and more
- Interactive leaderboard with sortable results
- Detailed analysis and key findings

## Features

- 📊 **Interactive Leaderboard**: Sort and filter model results by performance metrics
- 🔍 **Detailed Analysis**: Key findings with supporting figures
- 📱 **Responsive Design**: Optimized for desktop and mobile devices
- 🎯 **Task Categories**: Comprehensive breakdown of surgical AI capabilities
- 📖 **Academic Format**: Professional presentation following research paper standards

## Local Development

This is a static HTML website that requires no build process.

### Quick Start

1. Clone or download this directory
2. Open `index.html` in your web browser, or
3. Serve locally using any static file server:

```bash
# Using Python
python -m http.server 8000

# Using Node.js
npx serve .

# Using PHP
php -S localhost:8000
```

Then visit `http://localhost:8000`

## File Structure

```
website2/
├── index.html              # Main website file
├── static/
│   ├── css/               # Stylesheets (Bulma + custom)
│   ├── js/                # JavaScript files
│   ├── images/            # Research figures and assets
│   └── data/              # Leaderboard data (CSV format)
└── README.md              # This file
```

## Data Sources

- **Leaderboard Data**: `static/data/results.csv` - Contains performance metrics for all evaluated models
- **Research Figures**: `static/images/figure*.png` - Supporting figures from the research paper
- **Model Metadata**: Integrated into the leaderboard display with detailed information

## Technologies Used

- **HTML5** with semantic markup
- **Bulma CSS** framework for responsive design
- **Vanilla JavaScript** for interactivity
- **FontAwesome** and **Academicons** for icons
- **Google Fonts** for typography

## Citation

```bibtex
@article{mayer2025challenging,
  title={Challenging Vision-Language Models with Surgical Data: A New Dataset and Broad Benchmarking Study},
  author={Mayer, Leon and R{&quot;a}dsch, Tim and Michael, Dominik and Luttner, Lucas and Yamlahi, Amine and Christodoulou, Evangelia and Godau, Patrick and Knopp, Marcel and Reinke, Annika and Kolbinger, Fiona and Maier-Hein, Lena},
  journal={arXiv preprint arXiv:2506.06232},
  year={2025}
}
```

## Links

- **Paper**: [arXiv:2506.06232](https://arxiv.org/abs/2506.06232v1)
- **Dataset**: Coming soon
- **Code**: Coming soon

## License

This website template is based on [Nerfies](https://github.com/nerfies/nerfies.github.io) and is licensed under a Creative Commons Attribution-ShareAlike 4.0 International License.

## Acknowledgments

We thank all the medical professionals and researchers who contributed to this benchmark. This work was supported by the German Cancer Research Center (DKFZ), the National Center for Tumor Diseases (NCT), and our international research partners.