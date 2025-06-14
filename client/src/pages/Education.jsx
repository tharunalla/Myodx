







import React, { useEffect, useState } from "react";
import styled from "styled-components";

const Container = styled.div`
  flex: 1;
  padding: 20px 20px;
  background: linear-gradient(135deg, #f0f4f8, #e0eafc);
  display: flex;
  flex-direction: column;
  align-items: center;
  overflow-y: auto;
`;

const Header = styled.h1`
  font-size: 3rem;
  color: #1d3557;
  margin-bottom: 30px;
  text-align: center;
  font-weight: 700;

  @media (max-width: 768px) {
    font-size: 2.5rem;
  }

  @media (max-width: 480px) {
    font-size: 2rem;
  }
`;

const VideoList = styled.div`
  width: 100%;
  max-width: 1200px;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 25px;
`;

const VideoCard = styled.div`
  background: white;
  border-radius: 16px;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  cursor: pointer;
  display: flex;
  flex-direction: column;

  &:hover {
    transform: translateY(-8px);
    box-shadow: 0 12px 24px rgba(0, 0, 0, 0.15);
  }
`;

const VideoWrapper = styled.div`
  position: relative;
  padding-top: 56.25%; /* 16:9 Aspect Ratio */
  overflow: hidden;
  background-color: #000;
  border-radius: 16px 16px 0 0;
`;

const VideoEmbed = styled.iframe`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border: none;
  border-radius: 16px 16px 0 0;
`;

const VideoContent = styled.div`
  padding: 20px;
  display: flex;
  flex-direction: column;
  flex-grow: 1;
`;

const Title = styled.h2`
  font-size: 1.5rem;
  color: #0a369d;
  margin-bottom: 12px;

  @media (max-width: 480px) {
    font-size: 1.3rem;
  }
`;

const Description = styled.p`
  flex-grow: 1;
  font-size: 1rem;
  color: #555;
  margin-bottom: 20px;

  @media (max-width: 480px) {
    font-size: 0.95rem;
  }
`;

const WatchMore = styled.a`
  align-self: flex-start;
  background: #0a369d;
  color: white;
  padding: 10px 18px;
  border-radius: 8px;
  font-weight: 600;
  text-decoration: none;
  font-size: 0.95rem;
  transition: background 0.3s;

  &:hover {
    background: #0747a6;
  }
`;

const Educational = () => {
  const [videos, setVideos] = useState([]);

  useEffect(() => {
    const fetchVideos = async () => {
      const data = [
        {
          id: 1,
          title: "What is Muscular Dystrophy?",
          description: "Learn about Muscular Dystrophy, its causes, and symptoms.",
          videoUrl: "https://www.youtube.com/embed/DGOmN6rnsNk",
          watchMoreUrl: "https://www.youtube.com/watch?v=gzL9q5zLz_8",
        },
        {
          id: 2,
          title: "Living with Muscular Dystrophy",
          description: "A personal journey of living and thriving with MD.",
          videoUrl: "https://www.youtube.com/embed/VdCQq483reQ",
          watchMoreUrl: "https://www.youtube.com/watch?v=UhA1dA8Gp2k",
        },
        {
          id: 3,
          title: "Duchenne Muscular Dystrophy Explained",
          description: "An animated guide to Duchenne MD.",
          videoUrl: "https://www.youtube.com/embed/hOAk_rpTl2o",
          watchMoreUrl: "https://www.youtube.com/watch?v=hOAk_rpTl2o",
        },
        {
          id: 4,
          title: "Genetics Behind Muscular Dystrophy",
          description: "Understanding the genetic causes of MD.",
          videoUrl: "https://www.youtube.com/embed/GGw8a6WbV1Y",
          watchMoreUrl: "https://www.youtube.com/watch?v=GGw8a6WbV1Y",
        },
        {
          id: 5,
          title: "Physical Therapy for Muscular Dystrophy",
          description: "How physical therapy can help manage MD symptoms.",
          videoUrl: "https://www.youtube.com/embed/8iaCQi2jNwU",
          watchMoreUrl: "https://www.youtube.com/watch?v=8iaCQi2jNwU",
        },
        {
          id: 6,
          title: "Muscular Dystrophy Research Advances",
          description: "Latest developments in MD research and treatments.",
          videoUrl: "https://www.youtube.com/embed/VAvAxL7O1T8",
          watchMoreUrl: "https://www.youtube.com/watch?v=VAvAxL7O1T8",
        },
        {
          id: 7,
          title: "Introduction to Becker Muscular Dystrophy",
          description: "Symptoms, causes, and treatment options.",
          videoUrl: "https://www.youtube.com/embed/HBDzgtHRPuA",
          watchMoreUrl: "https://www.youtube.com/watch?v=HBDzgtHRPuA",
        },
        {
          id: 8,
          title: "Role of Occupational Therapy in MD",
          description: "Helping patients maintain independence.",
          videoUrl: "https://www.youtube.com/embed/-9BbCBTC_-I",
          watchMoreUrl: "https://www.youtube.com/watch?v=-9BbCBTC_-I",
        },
        {
          id: 9,
          title: "Stem Cell Therapy and MD",
          description: "Exploring the promise of stem cells in treating MD.",
          videoUrl: "https://www.youtube.com/embed/e9ZiegbF7Xo",
          watchMoreUrl: "https://www.youtube.com/watch?v=e9ZiegbF7Xo",
        },
        {
          id: 10,
          title: "Assistive Devices for MD",
          description: "Technologies that enhance mobility and life quality.",
          videoUrl: "https://www.youtube.com/embed/3b0y1eCVVdI",
          watchMoreUrl: "https://www.youtube.com/watch?v=3b0y1eCVVdI",
        },
        {
          id: 11,
          title: "Cardiac Care in Muscular Dystrophy",
          description: "Heart health issues linked with MD.",
          videoUrl: "https://www.youtube.com/embed/vJgUZmjmFpw",
          watchMoreUrl: "https://www.youtube.com/watch?v=vJgUZmjmFpw",
        },
        {
          id: 12,
          title: "Nutrition Tips for Muscular Dystrophy Patients",
          description: "Optimizing diet for strength and health.",
          videoUrl: "https://www.youtube.com/embed/YrNZKJ6xCcE",
          watchMoreUrl: "https://www.youtube.com/watch?v=YrNZKJ6xCcE",
        },
       
      ];
      
      setVideos(data);
    };

    fetchVideos();
  }, []);

  return (
    <Container>
      <Header>Explore Muscular Dystrophy Videos</Header>
      <VideoList>
        {videos.map((video) => (
          <VideoCard key={video.id}>
            <VideoWrapper>
              <VideoEmbed
                src={video.videoUrl}
                title={video.title}
                allowFullScreen
              ></VideoEmbed>
            </VideoWrapper>
            <VideoContent>
              <Title>{video.title}</Title>
              <Description>{video.description}</Description>
              <WatchMore href={video.watchMoreUrl} target="_blank" rel="noopener noreferrer">
                Watch More
              </WatchMore>
            </VideoContent>
          </VideoCard>
        ))}
      </VideoList>
    </Container>
  );
};

export default Educational;

