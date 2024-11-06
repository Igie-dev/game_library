"use client";

import { useState, useEffect, useDeferredValue, useCallback } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { LoaderCircle, Star } from "lucide-react";
import FeaturedGame from "./components/FeaturedGame";
import GameCard from "./components/GameCard";
export type TGame = {
  developer: string;
  freetogame_profile_url: string;
  game_url: string;
  genre: string;
  id: number;
  platform: string;
  publisher: string;
  release_date: string;
  short_description: string;
  thumbnail: string;
  title: string;
};

const api_key = import.meta.env.VITE_API_KEY;
export default function GameLibrary() {
  const [games, setGames] = useState<TGame[]>([]);
  const [filteredGames, setFilteredGames] = useState<TGame[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [platforms, setPlatforms] = useState<string[]>([]);
  const [selectedPlatform, setSelectedPlatform] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const deferredQuery = useDeferredValue(searchQuery); // Delayed state update for search
  const [favorites, setFavorites] = useState<number[]>([]);
  const [featuredGames, setFeaturedGames] = useState<TGame[]>([]);
  const [showFavorites, setShowFavorites] = useState(false);

  useEffect(() => {
    // Initialize the app
    fetchGames();
  }, []);

  useEffect(() => {
    // Filter games every time `games`, `selectedCategory`, `selectedPlaform` `,deferredQuery`, `favorites`, or `showFavorites` changes
    filterGames();
  }, [
    games,
    selectedPlatform,
    selectedCategory,
    deferredQuery,
    favorites,
    showFavorites,
  ]);

  const fetchGames = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `https://free-to-play-games-database.p.rapidapi.com/api/games?sort-by=alphabetical`,
        {
          method: "GET",
          headers: {
            "x-rapidapi-key": `${api_key}`,
            "x-rapidapi-host": "free-to-play-games-database.p.rapidapi.com",
          },
        }
      );
      const data: TGame[] = await response?.json();
      if (data.length) {
        setGames(data.slice(0, 200));
        setFeaturedGames(data.slice(0, 5));

        const uniqueCategories = Array.from(
          new Set(data.map((game) => game.genre))
        );
        const uniquePlatforms = Array.from(
          new Set(data.map((game) => game.platform))
        );
        setCategories(uniqueCategories);
        setPlatforms(uniquePlatforms);
      }
    } catch (error) {
      console.error("Error fetching games:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const filterGames = useCallback(() => {
    let filtered = [...games];

    if (showFavorites) {
      filtered = filtered.filter((game) => favorites.includes(game.id));
    }

    if (selectedCategory && selectedCategory !== "All") {
      filtered = filtered.filter((game) => game.genre === selectedCategory);
    }

    if (selectedPlatform && selectedPlatform !== "All") {
      filtered = filtered.filter((game) => game.platform === selectedPlatform);
    }

    if (deferredQuery) {
      filtered = filtered.filter((game) =>
        game.title.toLowerCase().includes(deferredQuery.toLowerCase())
      );
    }

    setFilteredGames(filtered);
  }, [
    games,
    deferredQuery,
    favorites,
    showFavorites,
    selectedCategory,
    selectedPlatform,
  ]);

  const loadFavorites = () => {
    const storedFavorites = localStorage.getItem("favorites");
    if (storedFavorites) {
      setFavorites(JSON.parse(storedFavorites));
    }
  };

  const toggleShowFavorites = () => {
    setShowFavorites((prev) => !prev);
    loadFavorites();
  };

  return (
    <div className="container px-4 py-8 mx-auto">
      <h1 className="mb-8 text-4xl font-bold">Free Game Library</h1>
      <FeaturedGame featuredGames={featuredGames} />
      <div className="flex flex-col gap-4 mb-8 md:flex-row">
        <Input
          placeholder="Search games..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="md:w-1/3"
        />
        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger className="md:w-1/3">
            <SelectValue placeholder="Select a category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="All">All Categories</SelectItem>
            {categories.map((category) => (
              <SelectItem key={category} value={category}>
                {category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={selectedPlatform} onValueChange={setSelectedPlatform}>
          <SelectTrigger className="md:w-1/4">
            <SelectValue placeholder="Select a platform" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="All">All Platforms</SelectItem>
            {platforms.map((platform) => (
              <SelectItem key={platform} value={platform}>
                {platform}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button
          onClick={toggleShowFavorites}
          variant={showFavorites ? "default" : "outline"}
          className="md:w-1/3"
        >
          <Star className="w-4 h-4 mr-2" />
          {showFavorites ? "Show All Games" : "Show Favorites"}
        </Button>
      </div>

      <div className="relative grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {isLoading ? (
          <div className="absolute top-0 left-0 flex justify-center w-full h-32 pt-10 ">
            <LoaderCircle size={30} className="animate-spin" />
          </div>
        ) : !isLoading && filteredGames?.length ? (
          filteredGames.map((game) => <GameCard key={game.id} game={game} />)
        ) : !isLoading && games.length < 1 && featuredGames.length < 1 ? (
          <p>No game found!</p>
        ) : null}
      </div>
    </div>
  );
}
