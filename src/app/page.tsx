import { RequiresAuth } from "./ui/components/auth/auth.component";
import { SearchPage } from "./ui/components/search-page/search-page.component";

export default function Home() {
  return (
    <div className=" min-h-screen flex flex-col items-center justify-center">
      <RequiresAuth>
        <SearchPage />
      </RequiresAuth>
    </div>
  );
}
