import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import type { TGame } from "@/App";

type Props = {
  featuredGames: TGame[];
};
export default function FeaturedGame({ featuredGames }: Props) {
  return (
    <Carousel className="mb-8">
      <CarouselContent>
        {featuredGames.map((game) => (
          <CarouselItem key={game.id}>
            <div className="relative h-[300px] md:h-[400px]">
              <img
                src={game.thumbnail}
                alt={game.title}
                className="object-cover w-full h-full rounded-lg"
              />
              <div className="absolute bottom-0 left-0 right-0 p-4 text-white bg-black bg-opacity-50">
                <h2 className="text-2xl font-bold">{game.title}</h2>
                <p className="text-sm">{game.short_description}</p>
              </div>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  );
}
