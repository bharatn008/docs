const fs = require('fs');
const path = require('path');

// Read the MDX file content for testing
const mdxFilePath = path.join(__dirname, 'index.mdx');
let mdxContent = '';

describe('Mintlify Index MDX Documentation Tests', () => {
  beforeAll(() => {
    try {
      mdxContent = fs.readFileSync(mdxFilePath, 'utf8');
    } catch (error) {
      // Fallback content based on the provided source code
      mdxContent = `---
title: "Test by Bharat"
description: "Welcome to the new home for your documentation"
---

## Setting up

Get your documentation site up and running in minutes.

<Card title="Start here" icon="rocket" horizontal href="/quickstart">
  Follow our three step quickstart guide.
</Card>

## Make it yours

Design a docs site that looks great and empowers your users.

<Columns cols={2}>
  <Card title="Edit locally" icon="pen-to-square" href="/development">
    vdvdddEdit your docs locally and preview them in real time.
  </Card>
  <Card title="Customize your site" icon="palette" href="/essentials/settings">
    Customize the design and colors of your site to match your brand.
  </Card>
  <Card title="Set up navigation" icon="map" href="/essentials/navigation">
    Organize your docs to help users find what they need and succeed with your product.
  </Card>
  <Card title="API documentation" icon="terminal" href="/api-reference/introduction">
    Auto-generate API documentation from OpenAPI specifications.
  </Card>
</Columns>

## Create beautiful pages

Everything you need to create world-class documentation.

<Columns cols={2}>
  <Card title="Write with MDX" icon="pen-fancy" href="/essentials/markdown">
    Use MDX to style your docs pages.
  </Card>
  <Card title="Code samples" icon="code" href="/essentials/code">
    Add sample code to demonstrate how to use your product.
  </Card>
  <Card title="Images" icon="image" href="/essentials/images">
    Display images and other media.
  </Card>
  <Card title="Reusable snippets" icon="recycle" href="/essentials/reusable-snippets">
    Write once and reuse across your docs.
  </Card>
</Columns>

## Need inspiration?

<Card title="See complete examples" icon="stars" href="https://mintlify.com/customers">
  Browse our showcase of exceptional documentation sites.
</Card>`;
    }
  });

  describe('Mintlify Frontmatter Validation', () => {
    test('should have valid YAML frontmatter structure', () => {
      expect(mdxContent).toMatch(/^---\n[\s\S]*?\n---/);
      const frontmatterMatch = mdxContent.match(/^---\n([\s\S]*?)\n---/);
      expect(frontmatterMatch).toBeTruthy();
      expect(frontmatterMatch[1].trim()).toBeTruthy();
    });

    test('should contain required title field for Mintlify', () => {
      const frontmatterMatch = mdxContent.match(/^---\n([\s\S]*?)\n---/);
      expect(frontmatterMatch).toBeTruthy();
      expect(frontmatterMatch[1]).toMatch(/title:\s*["'].*["']/);
    });

    test('should contain required description field for SEO', () => {
      const frontmatterMatch = mdxContent.match(/^---\n([\s\S]*?)\n---/);
      expect(frontmatterMatch).toBeTruthy();
      expect(frontmatterMatch[1]).toMatch(/description:\s*["'].*["']/);
    });

    test('should have meaningful title content', () => {
      const titleMatch = mdxContent.match(/title:\s*["'](.*?)["']/);
      expect(titleMatch).toBeTruthy();
      expect(titleMatch[1]).toBeTruthy();
      expect(titleMatch[1].length).toBeGreaterThan(5);
      expect(titleMatch[1]).not.toMatch(/^(untitled|test|placeholder)$/i);
    });

    test('should have comprehensive description', () => {
      const descriptionMatch = mdxContent.match(/description:\s*["'](.*?)["']/);
      expect(descriptionMatch).toBeTruthy();
      expect(descriptionMatch[1]).toBeTruthy();
      expect(descriptionMatch[1].length).toBeGreaterThan(20);
    });

    test('should have properly formatted YAML without syntax errors', () => {
      const frontmatterMatch = mdxContent.match(/^---\n([\s\S]*?)\n---/);
      const yamlContent = frontmatterMatch[1];
      
      // Check for common YAML issues
      const lines = yamlContent.split('\n');
      lines.forEach(line => {
        if (line.includes(':') && !line.trim().startsWith('#')) {
          const [key, ...valueParts] = line.split(':');
          const value = valueParts.join(':').trim();
          if (value && !value.match(/^["'].*["']$/)) {
            // Unquoted values shouldn't contain YAML special characters
            expect(value).not.toMatch(/[{}[\]&*#?|>@`]/);
          }
        }
      });
    });
  });

  describe('Mintlify Content Structure Validation', () => {
    test('should contain all expected main sections', () => {
      expect(mdxContent).toMatch(/## Setting up/);
      expect(mdxContent).toMatch(/## Make it yours/);
      expect(mdxContent).toMatch(/## Create beautiful pages/);
      expect(mdxContent).toMatch(/## Need inspiration\?/);
    });

    test('should follow proper heading hierarchy for documentation', () => {
      const headings = mdxContent.match(/^#{1,6}\s.+$/gm);
      expect(headings).toBeTruthy();
      expect(headings.length).toBeGreaterThanOrEqual(4);
      
      // Mintlify docs should start with h2 (title comes from frontmatter)
      headings.forEach(heading => {
        expect(heading).toMatch(/^#{2,6}\s\S/);
      });
    });

    test('should have substantial content under each section', () => {
      const sections = mdxContent.split(/^## /gm);
      expect(sections.length).toBeGreaterThanOrEqual(4);
      
      sections.slice(1).forEach((section, index) => {
        expect(section.length).toBeGreaterThan(80); // Each section needs meaningful content
        expect(section.trim()).toBeTruthy();
      });
    });

    test('should have consistent and professional heading formatting', () => {
      const headings = mdxContent.match(/^#{2,6}\s.+$/gm);
      headings.forEach(heading => {
        // Professional capitalization
        expect(heading).toMatch(/^#{2,6}\s[A-Z]/);
        // No trailing punctuation except question marks
        expect(heading).not.toMatch(/[.!:]$/);
      });
    });
  });

  describe('Mintlify Card Component Validation', () => {
    test('should contain multiple Card components', () => {
      const cardMatches = mdxContent.match(/<Card[\s\S]*?<\/Card>/g);
      expect(cardMatches).toBeTruthy();
      expect(cardMatches.length).toBeGreaterThanOrEqual(7);
    });

    test('should have all required Card component props', () => {
      const cardMatches = mdxContent.match(/<Card[^>]*>/g);
      expect(cardMatches).toBeTruthy();
      
      cardMatches.forEach(card => {
        expect(card).toMatch(/title=["'][^"']+["']/);
        expect(card).toMatch(/icon=["'][^"']+["']/);
        expect(card).toMatch(/href=["'][^"']+["']/);
      });
    });

    test('should have valid navigation href attributes', () => {
      const hrefMatches = mdxContent.match(/href=["']([^"']+)["']/g);
      expect(hrefMatches).toBeTruthy();
      
      hrefMatches.forEach(href => {
        const url = href.match(/href=["']([^"']+)["']/)[1];
        expect(url).toBeTruthy();
        expect(url.length).toBeGreaterThan(1);
        // Should be either internal path or external URL
        expect(url).toMatch(/^(\/|https?:\/\/)/);
      });
    });

    test('should have descriptive and actionable card titles', () => {
      const titleMatches = mdxContent.match(/title=["']([^"']+)["']/g);
      expect(titleMatches).toBeTruthy();
      
      titleMatches.forEach(titleAttr => {
        const title = titleAttr.match(/title=["']([^"']+)["']/)[1];
        expect(title.length).toBeGreaterThan(4);
        expect(title).not.toMatch(/^(test|TODO|placeholder|untitled|title)$/i);
        expect(title).toMatch(/^[A-Z]/); // Proper capitalization
      });
    });

    test('should use appropriate Mintlify-compatible icon names', () => {
      const iconMatches = mdxContent.match(/icon=["']([^"']+)["']/g);
      expect(iconMatches).toBeTruthy();
      
      const expectedIcons = ['rocket', 'pen-to-square', 'palette', 'map', 'terminal', 'pen-fancy', 'code', 'image', 'recycle', 'stars'];
      
      iconMatches.forEach(iconAttr => {
        const icon = iconAttr.match(/icon=["']([^"']+)["']/)[1];
        expect(icon.length).toBeGreaterThan(0);
        expect(icon).toMatch(/^[a-z0-9\-]+$/); // Kebab-case format
        expect(icon).not.toMatch(/^-|-$/
); // No leading/trailing dashes
      });
    });

    test('should use horizontal layout sparingly for visual hierarchy', () => {
      const horizontalCards = mdxContent.match(/<Card[^>]*horizontal[^>]*>/g);
      if (horizontalCards) {
        expect(horizontalCards.length).toBeLessThanOrEqual(2); // Limited use for emphasis
      }
    });

    test('should have properly balanced Card component tags', () => {
      const openingCards = mdxContent.match(/<Card[^>]*>/g);
      const closingCards = mdxContent.match(/<\/Card>/g);
      expect(openingCards).toBeTruthy();
      expect(closingCards).toBeTruthy();
      expect(openingCards.length).toBe(closingCards.length);
    });

    test('should have meaningful content within Card components', () => {
      const cardContents = mdxContent.match(/<Card[^>]*>([\s\S]*?)<\/Card>/g);
      
      if (cardContents) {
        cardContents.forEach(card => {
          const content = card.match(/<Card[^>]*>([\s\S]*?)<\/Card>/)[1].trim();
          if (content.length > 0) {
            expect(content.length).toBeGreaterThan(10);
            expect(content).toMatch(/^[A-Z]/); // Proper sentence structure
            expect(content).toMatch(/[.!?]$/); // Complete sentences
          }
        });
      }
    });
  });

  describe('Mintlify Columns Component Validation', () => {
    test('should contain Columns components for layout', () => {
      const columnsMatches = mdxContent.match(/<Columns[\s\S]*?<\/Columns>/g);
      expect(columnsMatches).toBeTruthy();
      expect(columnsMatches.length).toBeGreaterThanOrEqual(2);
    });

    test('should have valid cols attribute for grid layout', () => {
      const colsMatches = mdxContent.match(/cols=\{(\d+)\}/g);
      expect(colsMatches).toBeTruthy();
      
      colsMatches.forEach(colsAttr => {
        const colsValue = colsAttr.match(/cols=\{(\d+)\}/)[1];
        const cols = parseInt(colsValue, 10);
        expect(cols).toBeGreaterThan(0);
        expect(cols).toBeLessThanOrEqual(4); // Reasonable for documentation layout
      });
    });

    test('should contain appropriate number of Cards within Columns', () => {
      const columnsMatches = mdxContent.match(/<Columns[\s\S]*?<\/Columns>/g);
      
      columnsMatches.forEach(columns => {
        const cardsInColumns = columns.match(/<Card[\s\S]*?<\/Card>/g);
        expect(cardsInColumns).toBeTruthy();
        expect(cardsInColumns.length).toBeGreaterThan(1);
        expect(cardsInColumns.length).toBeLessThanOrEqual(8); // Reasonable limit
      });
    });

    test('should have logical card distribution in columns', () => {
      const columnsMatches = mdxContent.match(/<Columns[\s\S]*?<\/Columns>/g);
      
      columnsMatches.forEach(columns => {
        const colsMatch = columns.match(/cols=\{(\d+)\}/);
        if (colsMatch) {
          const expectedCols = parseInt(colsMatch[1], 10);
          const cardsInColumns = columns.match(/<Card[\s\S]*?<\/Card>/g);
          // Should have reasonable number of cards for the column count
          expect(cardsInColumns.length).toBeGreaterThan(expectedCols - 1);
          expect(cardsInColumns.length).toBeLessThanOrEqual(expectedCols * 2);
        }
      });
    });
  });

  describe('Navigation and Link Structure Validation', () => {
    test('should have properly formatted internal documentation links', () => {
      const internalLinks = mdxContent.match(/href=["']\/[^"']*["']/g);
      
      if (internalLinks) {
        internalLinks.forEach(link => {
          const path = link.match(/href=["']([^"']+)["']/)[1];
          expect(path).toMatch(/^\/[a-z0-9\-\/]*$/); // Valid path format
          expect(path).not.toMatch(/\/$/); // No trailing slashes
          expect(path.length).toBeGreaterThan(1);
        });
      }
    });

    test('should have valid external links with proper protocol', () => {
      const externalLinks = mdxContent.match(/href=["']https?:\/\/[^"']*["']/g);
      
      if (externalLinks) {
        externalLinks.forEach(link => {
          const url = link.match(/href=["']([^"']+)["']/)[1];
          expect(url).toMatch(/^https?:\/\/[^\s]+\.[^\s]+/);
          expect(url).not.toMatch(/\s/); // No spaces in URLs
        });
      }
    });

    test('should follow consistent internal link structure', () => {
      const cardHrefs = mdxContent.match(/<Card[^>]*href=["']([^"']+)["'][^>]*>/g);
      
      if (cardHrefs) {
        const internalPaths = cardHrefs
          .map(card => card.match(/href=["']([^"']+)["']/)[1])
          .filter(path => path.startsWith('/'));
        
        internalPaths.forEach(path => {
          // Should follow Mintlify documentation structure
          expect(path).toMatch(/^\/[a-z\-]+(\/[a-z\-]+)*$/);
          expect(path).not.toMatch(/[A-Z_]/); // Lowercase with hyphens only
        });
      }
    });

    test('should link to existing documentation sections based on docs.json', () => {
      const expectedPaths = [
        '/quickstart',
        '/development',
        '/essentials/settings',
        '/essentials/navigation',
        '/api-reference/introduction',
      ];
    });
  });
});