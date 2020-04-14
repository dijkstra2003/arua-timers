<?php


namespace App\Listener;

use ApiPlatform\Core\EventListener\EventPriorities;
use App\Util\RequestLogger;
use Symfony\Component\EventDispatcher\EventSubscriberInterface;
use Symfony\Component\HttpKernel\Event\GetResponseEvent;
use Symfony\Component\HttpKernel\KernelEvents;

class RequestListener implements EventSubscriberInterface
{
    public static function getSubscribedEvents()
    {
        return [
            KernelEvents::REQUEST => ['onKernelRequest', EventPriorities::PRE_RESPOND]
        ];
    }

    public function onKernelRequest(GetResponseEvent $event)
    {
        $logger = new RequestLogger();
        $logger->logRequest($event->getRequest());
    }
}