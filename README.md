# Betacoronavirus sequence search embed

This is an embeddable component that you can include into your website to add a non-coding RNA sequence search.

The component sends search requests to EBI-backed API, run on EBI cloud infrastructure. It uses NHMMER, CMSCAN and 
also adds text search functionality, backed by EBI Lucene text search plugin.

The sequences were extracted from the NCBI Blast database and the metadata was obtained from the associated INSDC 
entries.

This plugin is written in React/Redux. It is bundled as a Web Component, so it should not clash with your website's 
javascript or CSS.

## Installation

Download this package directly from Github.

`git clone https://github.com/covid19sequencesearch/covid19sequencesearch.github.io.git`

Now you can add the component's javascript bundle (it contains all the styles and fonts) to your web page either 
directly or through an import with Webpack:

`<script type="text/javascript" src="/covid19sequencesearch.github.io/dist/covid19-sequence-search.js"></script>`

To use it just insert an html tag somewhere in your html:

```
<rnacentral-sequence-search databases='["betacoronavirus"]' />
```

To show some examples and/or enable the Rfam search, use:

```
<rnacentral-sequence-search 
    databases='["betacoronavirus"]'
    examples='[
        {"description": "2019-nCoV_N1-R primer", "urs": "", "sequence": "TCTGGTTACTGCCAGTTGAATCTG"}
    ]
    rfam="true"
/>
```

You can also customise some elements of this embeddable component. See what you can change [here](#layout).
The example below changes the color of the buttons:

```
<rnacentral-sequence-search
    databases='["betacoronavirus"]'
    customStyle='{
      "searchButtonColor": "#007c82",
      "clearButtonColor": "#6c757d"
    }'
/>
```

For a minimal example, see [example.html](./example.html).

## Attributes/parameters

Sequence search component accepts a number of attributes. You pass them as html attributes
and their values are strings (this is a requirement of Web Components):

#### layout

Parameters that you can use to customise some elements of this embeddable component

parameter                   | description                                                                       |
----------------------------|-----------------------------------------------------------------------------------|
fixCss                      | fix the CSS. Use *"fixCss": "true"* if the button sizes are different             |
linkColor                   | change the color of the links                                                     |
h3Color                     | change the color of the `Similar sequences` and `Rfam classification` text        |
h3Size                      | change the size of the `Similar sequences` and `Rfam classification` text         |
similarSeqText              | change the `Similar sequences` text                                               | 
facetColor                  | change the color of the facet title                                               |
facetSize                   | change the size of the facet title                                                |
seqTitleSize                | used in results, it changes the size of the title                                 |
seqInfoColor                | used in results, it changes the color of the text `number of nucleotides`         |
seqInfoSize                 | used in results, it changes the size of the text `number of nucleotides`          |
searchButtonColor           | change the color of the `Search` button                                           |
clearButtonColor            | change the color of the `Clear` button                                            |
uploadButtonColor           | change the color of the `Upload file` button                                      |
hideUploadButton            | hide the `Upload file` button. Use *"hideUploadButton": "true"* to hide the button|
loadMoreButtonColor         | change the color of the `Load more` button                                        |

## Developer details

### Local development

1. `npm install`

2. `npm run serve` to start a server on http://localhost:8080/

3. `npm run clean` to clean the dist folder of old assets

4. `npm run build` to generate a new distribution.
