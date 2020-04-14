<?php


namespace App\Listener;


use ApiPlatform\Core\EventListener\EventPriorities;
use App\Util\RequestLogger;
use Lexik\Bundle\JWTAuthenticationBundle\Event\JWTCreatedEvent;
use Symfony\Component\EventDispatcher\EventSubscriberInterface;
use Symfony\Component\HttpFoundation\RequestStack;
use Symfony\Component\HttpKernel\Event\GetResponseEvent;
use Symfony\Component\HttpKernel\KernelEvents;

class JWTListener implements EventSubscriberInterface
{
    public static function getSubscribedEvents()
    {
        return [
            'lexik_jwt_authentication.on_jwt_created' => ['onJWTCreated', EventPriorities::PRE_RESPOND]
        ];
    }

    /**
     * @var RequestStack
     */
    private $requestStack;

    /**
     * @param RequestStack $requestStack
     */
    public function __construct(RequestStack $requestStack)
    {
        $this->requestStack = $requestStack;
    }

    /**
     * When a JWT Token is created, add a new value in the payload called user.
     * This is used to identify users logged in with the medicore account.
     *
     * @param JWTCreatedEvent $event
     */
    public function onJWTCreated(JWTCreatedEvent $event)
    {
        $user = $this->getUser();
        $this->addPayloadToEvent($event, $user);
    }

    private function getUser() {
        $request = $this->requestStack->getCurrentRequest()->getContent();
        $user = json_decode($request, true)["user"];
        
        return $user;
    }

    /**
     * Adds the user to the payload of the event.
     * 
     * @param JWTCreatedEvent $event
     * @param string $user
     */
    private function addPayloadToEvent(JWTCreatedEvent $event, string $user) {
        $payload = $event->getData();
        $payload['user'] = $user;

        $event->setData($payload);
    }
}