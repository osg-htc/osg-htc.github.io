import { Box, Typography, Grid, Container } from '@mui/material';
import {
  ArticleCard,
  HorizontalArticleCard,
  filterArticles,
  getArticles,
  sortArticles,
} from '@chtc/web-components/content';

async function getNews() {
  const articles = await getArticles('CHTC', 'Articles', 'main');
  return sortArticles(filterArticles(articles, 'osg', 'news'));
}

export default async function Page() {
  const articles = await getNews();

  return (
    <>
      {articles.length > 0 && (
        <HorizontalArticleCard
          href={`/news/${articles[0].slug.join('/')}`}
          article={articles[0]}
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
              />
            </Grid>
          ))}
        </Grid>
      </Container>
    </>
  );
}
