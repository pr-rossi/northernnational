import React, { useEffect } from 'react';
import PageTransition from '../components/PageTransition';
import FeaturedBlogs from '../components/FeaturedBlogs';
import { Container, PageHeader } from '../components/ui/Layout';
import { useLenis } from '@studio-freight/react-lenis';

function Blog() {
  const lenis = useLenis();

  useEffect(() => {
    lenis?.scrollTo(0, { immediate: true });
  }, [lenis]);

  return (
    <PageTransition>
      <div className="min-h-screen bg-nn-bg">
        <PageHeader label="News" title="Dispatches" intro="New music, studio sessions and whatever else is happening with the band." />
        <Container className="pb-24 md:pb-40">
          <FeaturedBlogs limit={50} />
        </Container>
      </div>
    </PageTransition>
  );
}

export default Blog;
