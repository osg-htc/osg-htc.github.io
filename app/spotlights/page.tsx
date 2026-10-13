import ExportedImage from 'next-image-export-optimizer';
import { Box, Divider, Link, Typography, Grid, Container } from '@mui/material';
import { ArticleCard, HorizontalArticleCard } from '@chtc/web-components/content';
import { getSiteArticles } from '@/utils/articles';

export default async function Page() {
  const articles = await getSiteArticles('user');

  return (
    <>
      {articles.length > 0 && (
        <HorizontalArticleCard
          href={`/spotlights/${articles[0].slug.join('/')}`}
          article={articles[0]}
          imageComponent={ExportedImage}
        />
      )}
      <Box textAlign={'center'} py={5}>
        <Typography variant={'h2'}>Spotlights</Typography>
      </Box>
      <Container maxWidth={'xl'}>
        <Grid container spacing={1}>
          {articles.map((article) => (
            <Grid
              key={article.slug.join('-')}
              size={{
                xs: 12,
                md: 6,
                lg: 4,
              }}
            >
              <ArticleCard
                href={`/spotlights/${article.slug.join('/')}`}
                article={article}
                imageComponent={ExportedImage}
              />
            </Grid>
          ))}
        </Grid>

        <Divider sx={{ my: 4 }} />
        <Typography paragraph>
          The OSG Consortium is pleased to see OSG user spotlights reposted on
          the websites of other organizations. The spotlights should be reposted
          with credits to the OSG website and the original authors, as well as a
          link to the original posting. Any alterations to the text or images for
          the reposting should be agreed by the OSG Communications team. Please
          email <Link href='mailto:support@osg-htc.org'>support@osg-htc.org</Link>.
        </Typography>
      </Container>
    </>
  );
}
