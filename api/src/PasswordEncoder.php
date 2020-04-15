<?php

namespace App;

use Symfony\Component\Security\Core\Encoder\MessageDigestPasswordEncoder;
use Symfony\Component\Security\Core\Exception\BadCredentialsException;

class PasswordEncoder extends MessageDigestPasswordEncoder {
    
    /**
     * Overrides the password encoder from symonfy.
     */
    public function encodePassword($raw, $salt)
    {
        if ($this->isPasswordTooLong($raw)) {
            throw new BadCredentialsException('Invalid password.');
        }

        return md5(md5($raw) . $salt);
    }
}