import { Heart } from "lucide-react";

export function Footer() {
    return (
        <footer className="absolute bottom-0 left-0 right-0 z-50 flex justify-center py-12 opacity-60">
            <p className="footer-description">
                Created with
                <Heart className="w-4 h-4 fill-primary text-primary" />
                by
                <span className="text-primary font-normal">Chandan</span>

            </p>
        </footer>
    );
}
