export default function getAvatarURL(hash) {
    // Use default image if they don't have one
    if (hash == null) return "https://cdn.cloudflare.steamstatic.com/steamcommunity/public/images/avatars/fe/fef49e7fa7e1997310d705b2a6158ff8dc1cdfeb_full.jpg";
    
    // Show the image they are used
    return "http://cdn.akamai.steamstatic.com/steamcommunity/public/images/avatars/" + hash?.substr(0, 2) + "/" + hash + "_full.jpg";
}