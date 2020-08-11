sudo apt update && sudo apt upgrade -y
sudo apt-get install raspberrypi-kernel-headers

#paketquelle für wireguard hinzufügen (ist in unstable)
echo "deb http://deb.debian.org/debian/ unstable main" | sudo tee --append /etc/apt/sources.list.d/unstable.list

#key der quelle hinzufügen
wget -O - https://ftp-master.debian.org/keys/archive-key-$(lsb_release -sr).asc | sudo apt-key add -
sudo apt update

#priorität alle unstable pakete ändern, sodass nicht für alle pakete ein update aus unstable installiert wird
printf 'Package: *\nPin: release a=unstable\nPin-Priority: 150\n' | sudo tee --append /etc/apt/preferences.d/limit-unstable
sudo apt update

#paketquelle für wireguard prüfen:
sudo apt-cache policy wireguard

#wireguard installieren
sudo apt install wireguard -y

#erfolgreiche installation prüfen:
which wg
which wg-quick

#neue leere config datei anlegen:
sudo touch /etc/wireguard/wg0.conf
#wireguard netzwerkinterface starten:
sudo wg-quick up wg0

#prüfen ob wireguard modul loaded:
lsmod | grep wire
ifconfig wg0
sudo wg

#--> spätestens jetzt portforward auf wireguard udp port im router einrichten


#enable ip forwarding
cd /etc
ls -l sysctl*
sudo vi sysctl.conf 
# hier manuell ip4 forward=1 einkommentieren (aktivieren)

#qrencode installieren
sudo apt install qrencode -y

#config skripte installieren von github
wget https://github.com/adrianmihalko/wg_config/archive/master.zip
unzip -j master.zip -d wg_config
mkdir downloads
mv master.zip downloads/wg_config_script.zip

#server keys generieren
cd wg_config
wg genkey | tee server_private.key | wg pubkey > server_public.key

#server definition file generieren
cp wg.def.sample wg.def
vi wg.def
#inhalt:
#_INTERFACE=wg0
#_VPN_NET=192.168.99.0/24
#_SERVER_PORT=51820
#_SERVER_LISTEN=wg.example.com:$_SERVER_PORT
#_SERVER_PUBLIC_KEY=
#_SERVER_PRIVATE_KEY=
