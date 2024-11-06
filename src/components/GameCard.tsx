import React, { useEffect, useState } from "react";
import type { TGame } from "@/App";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Heart, ExternalLink } from "lucide-react";
type Props = {
  game: TGame;
};
export default function GameCard({ game }: Props) {
  const [isFavorite, setIsFavorite] = useState<boolean | null>(null);

  useEffect(() => {
    const storedFavorites: number[] = JSON.parse(
      localStorage.getItem("favorites") || "[]"
    );
    if (storedFavorites) {
      const isFav = storedFavorites.includes(game.id);
      setIsFavorite(isFav);
    }
  }, []);

  const toggleFavorite = (gameId: number) => {
    const favorites: number[] = JSON.parse(
      localStorage.getItem("favorites") || "[]"
    );
    const newFavorites = favorites.includes(gameId)
      ? favorites.filter((id) => id !== gameId)
      : [...favorites, gameId];
    setIsFavorite((prev) => !prev);
    localStorage.setItem("favorites", JSON.stringify(newFavorites));
  };

  return (
    <Dialog key={game.id}>
      <DialogTrigger asChild>
        <Card className="transition-shadow duration-200 cursor-pointer hover:shadow-lg">
          <CardHeader>
            <CardTitle>{game.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <img
              src={game.thumbnail}
              alt={game.title}
              className="object-cover w-full h-48 rounded-md"
            />
            <p className="mt-2 text-sm text-gray-600">
              {game.short_description}
            </p>
          </CardContent>
          <CardFooter className="flex justify-between">
            <div>{game.genre}</div>
            <Button
              variant="ghost"
              size="icon"
              onClick={(e) => {
                e.stopPropagation();
                toggleFavorite(game.id);
              }}
            >
              <Heart
                className={`h-6 w-6 ${
                  isFavorite ? "fill-red-500 text-red-500" : ""
                }`}
              />
              <span className="sr-only">Toggle favorite</span>
            </Button>
          </CardFooter>
        </Card>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[50rem]">
        <DialogHeader>
          <DialogTitle>{game.title}</DialogTitle>
          <DialogDescription>{game.short_description}</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <img
            src={game.thumbnail}
            alt={game.title}
            className="object-cover w-full h-[20rem] rounded-md"
          />
          <div className="grid items-center grid-cols-2 gap-4">
            <span className="font-bold">Developer:</span>
            <span>{game.developer}</span>
            <span className="font-bold">Publisher:</span>
            <span>{game.publisher}</span>
            <span className="font-bold">Release Date:</span>
            <span>{game.release_date}</span>
            <span className="font-bold">Genre:</span>
            <span>{game.genre}</span>
            <span className="font-bold">Platform:</span>
            <span>{game.platform}</span>
          </div>
        </div>
        <div className="flex justify-end space-x-2">
          <Button asChild>
            <a
              href={game.freetogame_profile_url}
              target="_blank"
              rel="noopener noreferrer"
            >
              View Profile
              <ExternalLink className="w-4 h-4 ml-2" />
            </a>
          </Button>
          <Button asChild>
            <a href={game.game_url} target="_blank" rel="noopener noreferrer">
              Play Now
              <ExternalLink className="w-4 h-4 ml-2" />
            </a>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
