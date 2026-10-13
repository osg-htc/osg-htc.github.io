import ExportedImage from 'next-image-export-optimizer';
import { Box, Typography, Grid, Container } from '@mui/material';
import { ArticleCard, HorizontalArticleCard } from '@chtc/web-components/content';
import { getSiteArticles } from '@/utils/articles';

export default async function Page() {
  const articles = await getSiteArticles('news');

  return (
    <>
      {articles.length > 0 && (
        <HorizontalArticleCard
          href={`/news/${articles[0].slug.join('/')}`}
          article={articles[0]}
          imageComponent={ExportedImage}
        />
      )}
      <Box textAlign={'center'} py={5}>
        <Typography variant={'h2'}>News</Typography>
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
                href={`/news/${article.slug.join('/')}`}
                article={article}
                imageComponent={ExportedImage}
              />
            </Grid>
          ))}
        </Grid>
      </Container>
    </>
  );
}
